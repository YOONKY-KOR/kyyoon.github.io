const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require("fs");
const path = require("path");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const CONTENT_ROOT = path.join(__dirname, "../content");

// Notion Category → Hugo section 폴더 매핑
const CATEGORY_MAP = {
  "Architecture": "architecture",
  "Azure": "tech-references",
  "Claude / AI": "claude-guide",
  "Dev Notes": "posts",
  "Japan Life": "posts",
};

function getSectionDir(category) {
  return CATEGORY_MAP[category] || "posts";
}

async function syncPosts() {
  console.log("Fetching posts from Notion...");

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
  });

  const syncedFiles = new Set();

  for (const page of response.results) {
    const props = page.properties;

    const title = props.Title?.title?.[0]?.plain_text || "Untitled";
    const slug = props.Slug?.rich_text?.[0]?.plain_text || slugify(title);
    const date = page.created_time.split("T")[0];
    const tags = (props.Tags?.multi_select || []).map((t) => t.name);
    const category = props.Category?.select?.name || "";
    const summary = props.Summary?.rich_text?.[0]?.plain_text || "";
    const series = props.Series?.rich_text?.[0]?.plain_text || "";
    const seriesOrder = props["Series Order"]?.number ?? null;
    const coverUrl = props["Cover URL"]?.url || "";

    const section = getSectionDir(category);
    const outputDir = path.join(CONTENT_ROOT, section);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const lines = [
      `---`,
      `title: "${escapeQuotes(title)}"`,
      `date: ${date}`,
      `draft: false`,
    ];

    if (tags.length > 0) {
      lines.push(`tags: [${tags.map((t) => `"${t}"`).join(", ")}]`);
    }
    if (category) {
      lines.push(`categories: ["${category}"]`);
    }
    if (summary) {
      lines.push(`description: "${escapeQuotes(summary)}"`);
    }
    if (coverUrl) {
      lines.push(`cover:`);
      lines.push(`  image: "${coverUrl}"`);
      lines.push(`  alt: "${escapeQuotes(title)}"`);
    }
    if (series) {
      lines.push(`series: ["${escapeQuotes(series)}"]`);
      if (seriesOrder !== null) {
        lines.push(`series_weight: ${seriesOrder}`);
      }
    }
    lines.push(`showToc: true`);
    lines.push(`---`);
    lines.push(``);

    const content = lines.join("\n") + "\n" + mdString.parent;
    const filename = `${slug}.md`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, content, "utf-8");
    console.log(`Synced: ${section}/${filename}`);
    syncedFiles.add(`${section}/${filename}`);
  }

  console.log(`Sync complete. ${syncedFiles.size} post(s) written.`);
  syncedFiles.forEach((f) => console.log(`  ✓ ${f}`));
}

function escapeQuotes(str) {
  return str.replace(/"/g, '\\"');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\uAC00-\uD7A3\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

syncPosts().catch(console.error);
