use std::path::{Path, PathBuf};
use std::sync::Mutex;

use chrono::{Local, Utc};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_dialog::DialogExt;
use walkdir::WalkDir;

// ───────────────────────── Types ─────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(rename = "blogPath")]
    pub blog_path: String,
}

#[derive(Debug, Serialize)]
pub struct ArticleSummary {
    #[serde(rename = "relativePath")]
    relative_path: String,
    filename: String,
    title: String,
    description: String,
    date: String,
    mtime: f64,
}

#[derive(Debug, Serialize)]
pub struct ArticleDetail {
    #[serde(rename = "relativePath")]
    relative_path: String,
    filename: String,
    title: String,
    content: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateArticlePayload {
    title: String,
    #[serde(default)]
    description: String,
    #[serde(default)]
    tags: String,
    #[serde(default)]
    category: String,
}

#[derive(Debug, Deserialize)]
pub struct SaveArticlePayload {
    #[serde(rename = "relativePath")]
    relative_path: String,
    content: String,
}

#[derive(Debug, Deserialize)]
pub struct PublishPayload {
    #[serde(rename = "relativePath")]
    relative_path: String,
    content: String,
    #[serde(default)]
    title: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RenameArticlePayload {
    #[serde(rename = "relativePath")]
    relative_path: String,
    #[serde(rename = "newTitle")]
    new_title: String,
}

#[derive(Debug, Serialize)]
pub struct PageSummary {
    #[serde(rename = "relativePath")]
    relative_path: String,
    label: String,
    title: String,
}

#[derive(Debug, Serialize)]
pub struct PageDetail {
    #[serde(rename = "relativePath")]
    relative_path: String,
    label: String,
    title: String,
    content: String,
}

#[derive(Debug, Deserialize)]
pub struct SavePagePayload {
    #[serde(rename = "relativePath")]
    relative_path: String,
    content: String,
}

#[derive(Debug, Deserialize)]
pub struct PublishPagePayload {
    #[serde(rename = "relativePath")]
    relative_path: String,
    content: String,
    #[serde(default)]
    title: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
struct PublishLogEntry {
    stream: String,
    text: String,
}

#[derive(Debug, Serialize)]
pub struct SavedArticleSummary {
    #[serde(rename = "relativePath")]
    relative_path: String,
    title: String,
}

pub struct AppState {
    config: Mutex<Option<AppConfig>>,
}

// ───────────────────────── Config persistence ─────────────────────────

fn config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("无法定位配置目录：{e}"))?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("config.json"))
}

fn load_persisted_config(app: &AppHandle) -> Option<AppConfig> {
    let path = config_path(app).ok()?;
    let raw = std::fs::read_to_string(&path).ok()?;
    serde_json::from_str(&raw).ok()
}

fn save_persisted_config(app: &AppHandle, cfg: &AppConfig) -> Result<(), String> {
    let path = config_path(app)?;
    let raw = serde_json::to_string_pretty(cfg).map_err(|e| e.to_string())?;
    std::fs::write(&path, raw).map_err(|e| e.to_string())
}

fn current_config(state: &State<AppState>) -> Result<AppConfig, String> {
    state
        .config
        .lock()
        .unwrap()
        .clone()
        .ok_or_else(|| "未设置博客路径".to_string())
}

// ───────────────────────── Path helpers ─────────────────────────

fn article_dir(blog_path: &str) -> PathBuf {
    PathBuf::from(blog_path).join("docs").join("articles")
}

fn image_dir(blog_path: &str) -> PathBuf {
    PathBuf::from(blog_path)
        .join("docs")
        .join("public")
        .join("images")
}

fn normalize_relative(p: &str) -> String {
    p.replace('\\', "/").trim_start_matches('/').to_string()
}

fn resolve_article_path(blog_path: &str, relative: &str) -> Result<PathBuf, String> {
    let normalized = normalize_relative(relative);
    let candidate = PathBuf::from(blog_path).join(&normalized);
    let canonical = std::fs::canonicalize(&candidate)
        .or_else(|_| Ok::<PathBuf, std::io::Error>(candidate.clone()))
        .map_err(|e: std::io::Error| e.to_string())?;
    let root = article_dir(blog_path);
    let root_canonical = std::fs::canonicalize(&root)
        .or_else(|_| Ok::<PathBuf, std::io::Error>(root.clone()))
        .map_err(|e: std::io::Error| e.to_string())?;
    if !canonical.starts_with(&root_canonical) {
        return Err("文章路径不在 docs/articles 目录内".into());
    }
    Ok(canonical)
}

fn allowed_page_files(blog_path: &str) -> Vec<(&'static str, PathBuf)> {
    let docs = PathBuf::from(blog_path).join("docs");
    vec![
        ("首页", docs.join("index.md")),
        ("关于", docs.join("about.md")),
        ("文章列表", docs.join("articles").join("index.md")),
    ]
}

fn canonical_or_self(p: &Path) -> PathBuf {
    std::fs::canonicalize(p).unwrap_or_else(|_| p.to_path_buf())
}

fn resolve_page_path(blog_path: &str, relative: &str) -> Result<PathBuf, String> {
    let normalized = normalize_relative(relative);
    let candidate = PathBuf::from(blog_path).join(&normalized);
    let candidate_canon = canonical_or_self(&candidate);
    for (_, allowed) in allowed_page_files(blog_path) {
        if canonical_or_self(&allowed) == candidate_canon {
            return Ok(candidate_canon);
        }
    }
    Err("该文件不在允许编辑的页面白名单内".into())
}

fn label_for_page(blog_path: &str, absolute: &Path) -> Option<&'static str> {
    let abs_canon = canonical_or_self(absolute);
    for (label, allowed) in allowed_page_files(blog_path) {
        if canonical_or_self(&allowed) == abs_canon {
            return Some(label);
        }
    }
    None
}

fn to_posix_relative(blog_path: &str, absolute: &Path) -> String {
    let rel = absolute
        .strip_prefix(blog_path)
        .unwrap_or(absolute)
        .to_string_lossy()
        .replace('\\', "/");
    rel
}

// ───────────────────────── Slug + filename ─────────────────────────

fn make_slug(title: &str) -> String {
    use pinyin::ToPinyin;
    let parts: Vec<String> = title
        .chars()
        .map(|c| {
            c.to_pinyin()
                .map(|p| p.plain().to_string())
                .unwrap_or_else(|| c.to_string())
        })
        .collect();
    let joined = parts.join(" ");
    let slugged = slug::slugify(&joined);
    if slugged.is_empty() {
        format!("article-{}", Utc::now().timestamp_millis())
    } else {
        slugged
    }
}

fn unique_article_path(blog_path: &str, base_slug: &str) -> (String, PathBuf) {
    unique_path_in(&article_dir(blog_path), base_slug, None)
}

fn unique_path_in(dir: &Path, base_slug: &str, exclude: Option<&Path>) -> (String, PathBuf) {
    let exclude_canon = exclude.map(canonical_or_self);
    let mut candidate = base_slug.to_string();
    let mut idx = 2;
    loop {
        let p = dir.join(format!("{}.md", candidate));
        let blocked = p.exists()
            && exclude_canon
                .as_ref()
                .map_or(true, |e| canonical_or_self(&p) != *e);
        if !blocked {
            return (candidate, p);
        }
        candidate = format!("{}-{}", base_slug, idx);
        idx += 1;
    }
}

fn build_image_filename(slug_hint: &str) -> String {
    let cleaned: String = slug_hint
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '_' || c == '-' {
                c
            } else {
                '-'
            }
        })
        .collect();
    let trimmed = cleaned.trim_matches('-');
    let stamp = Local::now().format("%Y%m%d").to_string();
    let mut rand_bytes = [0u8; 3];
    rand::thread_rng().fill_bytes(&mut rand_bytes);
    let hex_part = hex::encode(rand_bytes);
    if trimmed.is_empty() {
        format!("{}-{}.png", stamp, hex_part)
    } else {
        format!("{}-{}-{}.png", trimmed, stamp, hex_part)
    }
}

// ───────────────────────── Frontmatter helpers ─────────────────────────

fn extract_frontmatter_field(content: &str, key: &str) -> Option<String> {
    let trimmed = content.trim_start();
    if !trimmed.starts_with("---") {
        return None;
    }
    let after_open = &trimmed[3..];
    let close_idx = after_open.find("\n---")?;
    let body = &after_open[..close_idx];
    for line in body.lines() {
        let line = line.trim_start();
        if let Some(rest) = line.strip_prefix(&format!("{}:", key)) {
            return Some(rest.trim().trim_matches('"').trim_matches('\'').to_string());
        }
    }
    None
}

fn set_frontmatter_field(content: &str, key: &str, value: &str, replace_existing: bool) -> String {
    let leading_len = content.len() - content.trim_start().len();
    let leading = &content[..leading_len];
    let trimmed = &content[leading_len..];

    if !trimmed.starts_with("---") {
        return format!("{}---\n{}: {}\n---\n\n{}", leading, key, value, trimmed);
    }
    let after_open = &trimmed[3..];
    let close_idx = match after_open.find("\n---") {
        Some(i) => i,
        None => return content.to_string(),
    };
    let body = &after_open[..close_idx];
    let after_close = &after_open[close_idx..];

    let prefix = format!("{}:", key);
    let mut found = false;
    let mut new_lines: Vec<String> = Vec::new();
    for line in body.lines() {
        if line.trim_start().starts_with(&prefix) {
            found = true;
            if replace_existing {
                new_lines.push(format!("{}: {}", key, value));
            } else {
                new_lines.push(line.to_string());
            }
        } else {
            new_lines.push(line.to_string());
        }
    }
    if found && !replace_existing {
        return content.to_string();
    }
    if !found {
        new_lines.push(format!("{}: {}", key, value));
    }
    let new_body = new_lines.join("\n");
    format!("{}---{}{}", leading, new_body, after_close)
}

fn build_new_article_content(payload: &CreateArticlePayload, slug: &str) -> String {
    let today = Local::now().format("%Y-%m-%d").to_string();
    let tags = parse_comma_list(&payload.tags);
    let cats = parse_comma_list(&payload.category);
    let tags_yaml = format_yaml_list(&tags);
    let cats_yaml = format_yaml_list(&cats);
    format!(
        "---\ntitle: {}\ndescription: {}\ndate: {}\ntags: {}\ncategories: {}\npermalink: /articles/{}/\n---\n\n# {}\n\n",
        payload.title, payload.description, today, tags_yaml, cats_yaml, slug, payload.title
    )
}

fn parse_comma_list(s: &str) -> Vec<String> {
    s.split(',')
        .map(|x| x.trim().to_string())
        .filter(|x| !x.is_empty())
        .collect()
}

fn format_yaml_list(items: &[String]) -> String {
    if items.is_empty() {
        "[]".to_string()
    } else {
        format!("[{}]", items.join(", "))
    }
}

// ───────────────────────── Commands ─────────────────────────

#[tauri::command]
async fn get_config(app: AppHandle, state: State<'_, AppState>) -> Result<AppConfig, String> {
    if let Some(cfg) = state.config.lock().unwrap().clone() {
        return Ok(cfg);
    }
    let folder = app
        .dialog()
        .file()
        .set_title("选择博客根目录")
        .blocking_pick_folder()
        .ok_or_else(|| "未选择博客根目录".to_string())?;
    let path_str = folder.to_string();
    let cfg = AppConfig {
        blog_path: path_str,
    };
    save_persisted_config(&app, &cfg)?;
    *state.config.lock().unwrap() = Some(cfg.clone());
    Ok(cfg)
}

#[tauri::command]
async fn list_articles(state: State<'_, AppState>) -> Result<Vec<ArticleSummary>, String> {
    let cfg = current_config(&state)?;
    let dir = article_dir(&cfg.blog_path);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let mut articles: Vec<ArticleSummary> = Vec::new();
    for entry in WalkDir::new(&dir).into_iter().filter_map(|e| e.ok()) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("md") {
            continue;
        }
        let content = match std::fs::read_to_string(path) {
            Ok(c) => c,
            Err(_) => continue,
        };
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        let mtime = metadata
            .modified()
            .ok()
            .and_then(|m| m.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs_f64() * 1000.0)
            .unwrap_or(0.0);
        let filename = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();
        let stem = path
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();
        let title = extract_frontmatter_field(&content, "title").unwrap_or(stem);
        let description = extract_frontmatter_field(&content, "description").unwrap_or_default();
        let date = extract_frontmatter_field(&content, "date").unwrap_or_default();
        let relative_path = to_posix_relative(&cfg.blog_path, path);
        articles.push(ArticleSummary {
            relative_path,
            filename,
            title,
            description,
            date,
            mtime,
        });
    }
    articles.sort_by(|a, b| b.mtime.partial_cmp(&a.mtime).unwrap_or(std::cmp::Ordering::Equal));
    Ok(articles)
}

#[tauri::command]
async fn read_article(
    state: State<'_, AppState>,
    relative_path: String,
) -> Result<ArticleDetail, String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_article_path(&cfg.blog_path, &relative_path)?;
    let content = std::fs::read_to_string(&absolute).map_err(|e| e.to_string())?;
    let filename = absolute
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    let stem = absolute
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    let title = extract_frontmatter_field(&content, "title").unwrap_or(stem);
    Ok(ArticleDetail {
        relative_path: normalize_relative(&relative_path),
        filename,
        title,
        content,
    })
}

#[tauri::command]
async fn create_article(
    state: State<'_, AppState>,
    payload: CreateArticlePayload,
) -> Result<ArticleDetail, String> {
    let cfg = current_config(&state)?;
    let title = payload.title.trim().to_string();
    if title.is_empty() {
        return Err("标题不能为空".into());
    }
    std::fs::create_dir_all(article_dir(&cfg.blog_path)).map_err(|e| e.to_string())?;
    let base_slug = make_slug(&title);
    let (slug, absolute) = unique_article_path(&cfg.blog_path, &base_slug);
    let payload_with_trimmed = CreateArticlePayload {
        title: title.clone(),
        description: payload.description.trim().to_string(),
        tags: payload.tags,
        category: payload.category,
    };
    let content = build_new_article_content(&payload_with_trimmed, &slug);
    std::fs::write(&absolute, &content).map_err(|e| e.to_string())?;
    let relative = to_posix_relative(&cfg.blog_path, &absolute);
    Ok(ArticleDetail {
        relative_path: relative,
        filename: absolute
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string(),
        title,
        content,
    })
}

#[tauri::command]
async fn save_article(
    state: State<'_, AppState>,
    payload: SaveArticlePayload,
) -> Result<SavedArticleSummary, String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_article_path(&cfg.blog_path, &payload.relative_path)?;
    std::fs::write(&absolute, &payload.content).map_err(|e| e.to_string())?;
    let stem = absolute
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    let title = extract_frontmatter_field(&payload.content, "title").unwrap_or(stem);
    Ok(SavedArticleSummary {
        relative_path: normalize_relative(&payload.relative_path),
        title,
    })
}

#[tauri::command]
async fn save_pasted_image(
    state: State<'_, AppState>,
    bytes: Vec<u8>,
    slug: String,
) -> Result<String, String> {
    let cfg = current_config(&state)?;
    let dir = image_dir(&cfg.blog_path);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let img = image::load_from_memory(&bytes).map_err(|e| format!("无法读取粘贴的图片：{e}"))?;
    let filename = build_image_filename(&slug);
    let absolute = dir.join(&filename);
    img.save_with_format(&absolute, image::ImageFormat::Png)
        .map_err(|e| e.to_string())?;
    Ok(format!("![](/images/{})", filename))
}

#[tauri::command]
async fn save_clipboard_image(
    state: State<'_, AppState>,
    slug: String,
) -> Result<String, String> {
    let cfg = current_config(&state)?;
    let dir = image_dir(&cfg.blog_path);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let mut clipboard =
        arboard::Clipboard::new().map_err(|e| format!("无法访问剪贴板：{e}"))?;
    let img_data = clipboard
        .get_image()
        .map_err(|_| "剪贴板里没有图片".to_string())?;
    let rgba = image::RgbaImage::from_raw(
        img_data.width as u32,
        img_data.height as u32,
        img_data.bytes.into_owned(),
    )
    .ok_or_else(|| "剪贴板图片解析失败".to_string())?;
    let filename = build_image_filename(&slug);
    let absolute = dir.join(&filename);
    image::DynamicImage::ImageRgba8(rgba)
        .save_with_format(&absolute, image::ImageFormat::Png)
        .map_err(|e| e.to_string())?;
    Ok(format!("![](/images/{})", filename))
}

async fn run_git(
    app: &AppHandle,
    cwd: &str,
    args: &[&str],
) -> Result<(), String> {
    use tokio::io::{AsyncBufReadExt, BufReader};
    use tokio::process::Command;

    let display = args.join(" ");
    let _ = app.emit(
        "publish-log",
        PublishLogEntry {
            stream: "cmd".into(),
            text: format!("git {}\n", display),
        },
    );

    let mut child = Command::new("git")
        .args(args)
        .current_dir(cwd)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("启动 git 失败：{e}"))?;

    let stdout = child.stdout.take().expect("stdout piped");
    let stderr = child.stderr.take().expect("stderr piped");

    let app_out = app.clone();
    let stdout_task = tokio::spawn(async move {
        let mut reader = BufReader::new(stdout).lines();
        while let Ok(Some(line)) = reader.next_line().await {
            let _ = app_out.emit(
                "publish-log",
                PublishLogEntry {
                    stream: "stdout".into(),
                    text: format!("{}\n", line),
                },
            );
        }
    });
    let app_err = app.clone();
    let stderr_task = tokio::spawn(async move {
        let mut reader = BufReader::new(stderr).lines();
        while let Ok(Some(line)) = reader.next_line().await {
            let _ = app_err.emit(
                "publish-log",
                PublishLogEntry {
                    stream: "stderr".into(),
                    text: format!("{}\n", line),
                },
            );
        }
    });

    let status = child
        .wait()
        .await
        .map_err(|e| format!("等待 git 失败：{e}"))?;
    let _ = stdout_task.await;
    let _ = stderr_task.await;

    if !status.success() {
        return Err(format!("git {} 失败", display));
    }
    Ok(())
}

#[tauri::command]
async fn publish_article(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: PublishPayload,
) -> Result<(), String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_article_path(&cfg.blog_path, &payload.relative_path)?;
    std::fs::write(&absolute, &payload.content).map_err(|e| e.to_string())?;
    let title = payload.title.unwrap_or_else(|| {
        absolute
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned()
    });
    let relative = to_posix_relative(&cfg.blog_path, &absolute);

    run_git(
        &app,
        &cfg.blog_path,
        &["add", &relative, "docs/public/images/"],
    )
    .await?;
    run_git(
        &app,
        &cfg.blog_path,
        &["commit", "-m", &format!("feat: add article {}", title)],
    )
    .await?;
    run_git(&app, &cfg.blog_path, &["push", "origin", "main"]).await?;
    Ok(())
}

#[tauri::command]
async fn delete_article(
    app: AppHandle,
    state: State<'_, AppState>,
    relative_path: String,
) -> Result<(), String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_article_path(&cfg.blog_path, &relative_path)?;
    let title = std::fs::read_to_string(&absolute)
        .ok()
        .and_then(|c| extract_frontmatter_field(&c, "title"))
        .unwrap_or_else(|| {
            absolute
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned()
        });
    std::fs::remove_file(&absolute).map_err(|e| e.to_string())?;

    run_git(&app, &cfg.blog_path, &["add", "-A"]).await?;
    run_git(
        &app,
        &cfg.blog_path,
        &["commit", "-m", &format!("chore: delete article {}", title)],
    )
    .await?;
    run_git(&app, &cfg.blog_path, &["push", "origin", "main"]).await?;
    Ok(())
}

#[tauri::command]
async fn rename_article(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: RenameArticlePayload,
) -> Result<ArticleDetail, String> {
    let cfg = current_config(&state)?;
    let new_title = payload.new_title.trim().to_string();
    if new_title.is_empty() {
        return Err("新标题不能为空".into());
    }

    let old_absolute = resolve_article_path(&cfg.blog_path, &payload.relative_path)?;
    let old_stem = old_absolute
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();
    let original = std::fs::read_to_string(&old_absolute).map_err(|e| e.to_string())?;

    let with_permalink = set_frontmatter_field(
        &original,
        "permalink",
        &format!("/articles/{}/", old_stem),
        false,
    );
    let updated = set_frontmatter_field(&with_permalink, "title", &new_title, true);

    let new_slug = make_slug(&new_title);
    let (final_slug, new_absolute) =
        unique_path_in(&article_dir(&cfg.blog_path), &new_slug, Some(&old_absolute));

    let same_path = canonical_or_self(&new_absolute) == canonical_or_self(&old_absolute);
    let same_content = updated == original;

    if same_path && same_content {
        let relative = to_posix_relative(&cfg.blog_path, &old_absolute);
        let filename = old_absolute
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();
        return Ok(ArticleDetail {
            relative_path: relative,
            filename,
            title: new_title,
            content: original,
        });
    }

    std::fs::write(&new_absolute, &updated).map_err(|e| e.to_string())?;
    if !same_path {
        std::fs::remove_file(&old_absolute).map_err(|e| e.to_string())?;
    }

    run_git(&app, &cfg.blog_path, &["add", "-A"]).await?;
    run_git(
        &app,
        &cfg.blog_path,
        &[
            "commit",
            "-m",
            &format!("refactor: rename article {} -> {}", old_stem, final_slug),
        ],
    )
    .await?;
    run_git(&app, &cfg.blog_path, &["push", "origin", "main"]).await?;

    let relative = to_posix_relative(&cfg.blog_path, &new_absolute);
    let filename = new_absolute
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    Ok(ArticleDetail {
        relative_path: relative,
        filename,
        title: new_title,
        content: updated,
    })
}

#[tauri::command]
async fn list_pages(state: State<'_, AppState>) -> Result<Vec<PageSummary>, String> {
    let cfg = current_config(&state)?;
    let mut pages: Vec<PageSummary> = Vec::new();
    for (label, absolute) in allowed_page_files(&cfg.blog_path) {
        if !absolute.exists() {
            continue;
        }
        let content = std::fs::read_to_string(&absolute).unwrap_or_default();
        let stem = absolute
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        let title = extract_frontmatter_field(&content, "title").unwrap_or(stem);
        pages.push(PageSummary {
            relative_path: to_posix_relative(&cfg.blog_path, &absolute),
            label: label.to_string(),
            title,
        });
    }
    Ok(pages)
}

#[tauri::command]
async fn read_page(
    state: State<'_, AppState>,
    relative_path: String,
) -> Result<PageDetail, String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_page_path(&cfg.blog_path, &relative_path)?;
    let content = std::fs::read_to_string(&absolute).map_err(|e| e.to_string())?;
    let stem = absolute
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();
    let title = extract_frontmatter_field(&content, "title").unwrap_or(stem);
    let label = label_for_page(&cfg.blog_path, &absolute)
        .map(|s| s.to_string())
        .unwrap_or_else(|| "页面".to_string());
    Ok(PageDetail {
        relative_path: to_posix_relative(&cfg.blog_path, &absolute),
        label,
        title,
        content,
    })
}

#[tauri::command]
async fn save_page(
    state: State<'_, AppState>,
    payload: SavePagePayload,
) -> Result<SavedArticleSummary, String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_page_path(&cfg.blog_path, &payload.relative_path)?;
    std::fs::write(&absolute, &payload.content).map_err(|e| e.to_string())?;
    let stem = absolute
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();
    let title = extract_frontmatter_field(&payload.content, "title").unwrap_or(stem);
    Ok(SavedArticleSummary {
        relative_path: to_posix_relative(&cfg.blog_path, &absolute),
        title,
    })
}

#[tauri::command]
async fn publish_page(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: PublishPagePayload,
) -> Result<(), String> {
    let cfg = current_config(&state)?;
    let absolute = resolve_page_path(&cfg.blog_path, &payload.relative_path)?;
    std::fs::write(&absolute, &payload.content).map_err(|e| e.to_string())?;
    let title = payload.title.unwrap_or_else(|| {
        extract_frontmatter_field(&payload.content, "title").unwrap_or_else(|| {
            absolute
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned()
        })
    });
    let relative = to_posix_relative(&cfg.blog_path, &absolute);
    run_git(&app, &cfg.blog_path, &["add", &relative]).await?;
    run_git(
        &app,
        &cfg.blog_path,
        &["commit", "-m", &format!("chore: update page {}", title)],
    )
    .await?;
    run_git(&app, &cfg.blog_path, &["push", "origin", "main"]).await?;
    Ok(())
}

#[tauri::command]
async fn read_public_asset(
    state: State<'_, AppState>,
    relative_path: String,
) -> Result<Vec<u8>, String> {
    let cfg = current_config(&state)?;
    let normalized = normalize_relative(&relative_path);
    let public_root = PathBuf::from(&cfg.blog_path).join("docs").join("public");
    let candidate = public_root.join(&normalized);
    let candidate_canon = canonical_or_self(&candidate);
    let root_canon = canonical_or_self(&public_root);
    if !candidate_canon.starts_with(&root_canon) {
        return Err("路径不在 docs/public 内".into());
    }
    std::fs::read(&candidate_canon).map_err(|e| e.to_string())
}

// ───────────────────────── Entry point ─────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let handle = app.handle().clone();
            let persisted = load_persisted_config(&handle);
            app.manage(AppState {
                config: Mutex::new(persisted),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_config,
            list_articles,
            read_article,
            create_article,
            save_article,
            save_pasted_image,
            save_clipboard_image,
            publish_article,
            delete_article,
            rename_article,
            list_pages,
            read_page,
            save_page,
            publish_page,
            read_public_asset,
        ])
        .run(tauri::generate_context!())
        .expect("启动 Tauri 失败");
}
