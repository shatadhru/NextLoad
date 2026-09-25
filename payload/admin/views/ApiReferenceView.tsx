"use client"

import React, { useState, useCallback, CSSProperties } from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Code2,
  Zap,
  BookOpen,
  Package,
} from "lucide-react"

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"
type Language = "curl" | "javascript" | "typescript" | "python" | "php"

interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
}

interface ApiEndpoint {
  id: string
  method: HttpMethod
  path: string
  summary: string
  description: string
  auth: "none" | "optional" | "admin"
  queryParams?: ApiParam[]
  bodyParams?: ApiParam[]
  responseExample: object
  codeSnippets: Record<Language, string>
}

// ─────────────────────────────────────────────
//  Style constants (Payload admin CSS vars)
// ─────────────────────────────────────────────

const BASE = "https://yoursite.com"

const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string; border: string }> = {
  GET:    { bg: "rgba(16,185,129,0.1)", text: "#059669",  border: "rgba(16,185,129,0.35)" },
  POST:   { bg: "rgba(59,130,246,0.1)", text: "#2563eb",  border: "rgba(59,130,246,0.35)" },
  PATCH:  { bg: "rgba(245,158,11,0.1)", text: "#d97706",  border: "rgba(245,158,11,0.35)" },
  DELETE: { bg: "rgba(239,68,68,0.1)",  text: "#dc2626",  border: "rgba(239,68,68,0.35)"  },
}

const AUTH_INFO: Record<string, { label: string; bg: string; text: string; desc: string }> = {
  none:     { label: "Public",       bg: "rgba(0,0,0,0.05)",       text: "var(--theme-elevation-600, #666)", desc: "No authentication required." },
  optional: { label: "Optional Auth",bg: "rgba(13,148,136,0.1)",   text: "#0d9488",                         desc: "Works without auth (published only). Admins see all." },
  admin:    { label: "Admin Only",   bg: "rgba(239,68,68,0.1)",    text: "#dc2626",                         desc: "Requires an active admin session cookie." },
}

const LANG_LABELS: Record<Language, string> = {
  curl: "cURL", javascript: "JavaScript", typescript: "TypeScript", python: "Python", php: "PHP",
}

// ─────────────────────────────────────────────
//  Endpoint data
// ─────────────────────────────────────────────

const endpoints: ApiEndpoint[] = [
  {
    id: "list-products",
    method: "GET",
    path: "/api/products",
    summary: "List Products",
    description: "Retrieve a paginated list of products. Public users see only published products. Admins see all statuses.",
    auth: "optional",
    queryParams: [
      { name: "limit",    type: "number", required: false, description: "Max items per page (1–100). Default: 20" },
      { name: "page",     type: "number", required: false, description: "Page number. Default: 1" },
      { name: "category", type: "string", required: false, description: "Filter: general | clothing | electronics | digital" },
      { name: "search",   type: "string", required: false, description: "Full-text search on title and description" },
      { name: "sort",     type: "string", required: false, description: "Sort field (e.g. price, createdAt). Default: createdAt" },
      { name: "order",    type: "string", required: false, description: "asc or desc. Default: desc" },
    ],
    responseExample: {
      success: true,
      data: [{ id: "abc123", title: "T-Shirt", price: 29.99, category: "clothing", _status: "published" }],
      pagination: { total: 42, page: 1, limit: 20, totalPages: 3, hasNextPage: true, hasPrevPage: false },
    },
    codeSnippets: {
      curl: `curl -X GET "${BASE}/api/products?limit=20&page=1&category=clothing" \\
  -H "Accept: application/json"`,
      javascript: `const res = await fetch("/api/products?limit=20&page=1&category=clothing");
const { success, data, pagination } = await res.json();
console.log(data); // array of products`,
      typescript: `interface Product { id: string; title: string; price: number; _status: string }
interface Paginated  { success: boolean; data: Product[]; pagination: { total: number } }

const res = await fetch("/api/products?limit=20&page=1");
const json: Paginated = await res.json();
console.log(json.data);`,
      python: `import requests

r = requests.get("${BASE}/api/products", params={"limit": 20, "page": 1, "category": "clothing"})
data = r.json()
print(data["data"])   # list of products`,
      php: `<?php
$url = "${BASE}/api/products?limit=20&page=1&category=clothing";
$data = json_decode(file_get_contents($url), true);
print_r($data["data"]);`,
    },
  },
  {
    id: "get-product",
    method: "GET",
    path: "/api/products/:id",
    summary: "Get Product by ID",
    description: "Fetch a single product by its Payload document ID. Non-admins can only retrieve published products.",
    auth: "optional",
    queryParams: [
      { name: "id", type: "string", required: true, description: "Payload CMS document ID of the product" },
    ],
    responseExample: {
      success: true,
      data: { id: "abc123", title: "T-Shirt", description: "Premium cotton tee", price: 29.99, category: "clothing", _status: "published" },
    },
    codeSnippets: {
      curl: `curl -X GET "${BASE}/api/products/abc123"`,
      javascript: `const res = await fetch(\`/api/products/\${productId}\`);
const { data } = await res.json();
console.log(data.title, data.price);`,
      typescript: `interface Product { id: string; title: string; price: number }
const res = await fetch(\`/api/products/\${productId}\`);
const { data }: { success: boolean; data: Product } = await res.json();`,
      python: `import requests
r = requests.get(f"${BASE}/api/products/{product_id}")
product = r.json()["data"]
print(product["title"], product["price"])`,
      php: `<?php
$product = json_decode(file_get_contents("${BASE}/api/products/$productId"), true)["data"];
echo $product["title"] . " — $" . $product["price"];`,
    },
  },
  {
    id: "create-product",
    method: "POST",
    path: "/api/products",
    summary: "Create Product",
    description: "Create a new product. Requires an active admin session. Send as JSON with Content-Type header.",
    auth: "admin",
    bodyParams: [
      { name: "title",       type: "string", required: true,  description: "Product display name" },
      { name: "price",       type: "number", required: true,  description: "Price in the store's default currency" },
      { name: "description", type: "string", required: false, description: "Product description text" },
      { name: "category",    type: "string", required: false, description: "general | clothing | electronics | digital (default: general)" },
      { name: "image",       type: "string", required: false, description: "Media document ID (upload to /api/media first)" },
      { name: "status",      type: "string", required: false, description: "published | draft (default: draft)" },
    ],
    responseExample: {
      success: true,
      data: { id: "new456", title: "New Hoodie", price: 59.99, category: "clothing", _status: "draft", createdAt: "2026-09-25T12:00:00Z" },
    },
    codeSnippets: {
      curl: `curl -X POST "${BASE}/api/products" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: payload-token=YOUR_SESSION_COOKIE" \\
  -d '{
    "title": "New Hoodie",
    "price": 59.99,
    "category": "clothing",
    "description": "Premium fleece hoodie",
    "status": "draft"
  }'`,
      javascript: `const res = await fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",        // sends session cookie automatically
  body: JSON.stringify({
    title: "New Hoodie",
    price: 59.99,
    category: "clothing",
    status: "draft",
  }),
});
const { success, data } = await res.json();
console.log("Created product ID:", data.id);`,
      typescript: `interface CreateBody {
  title: string;
  price: number;
  description?: string;
  category?: "general" | "clothing" | "electronics" | "digital";
  image?: string;
  status?: "published" | "draft";
}

const res = await fetch("/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ title: "New Hoodie", price: 59.99 } satisfies CreateBody),
});
const json = await res.json();`,
      python: `import requests

s = requests.Session()
# s.cookies.set("payload-token", "YOUR_TOKEN")  # or POST /api/users/login first

r = s.post("${BASE}/api/products", json={
    "title": "New Hoodie",
    "price": 59.99,
    "category": "clothing",
    "status": "draft",
})
print(r.json())`,
      php: `<?php
$ch = curl_init("${BASE}/api/products");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(["title" => "New Hoodie", "price" => 59.99, "status" => "draft"]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json", "Cookie: payload-token=YOUR_TOKEN"],
]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
print_r($result);`,
    },
  },
  {
    id: "update-product",
    method: "PATCH",
    path: "/api/products/:id",
    summary: "Update Product",
    description: "Partially update an existing product. Only the fields you provide will be changed. Admin-only.",
    auth: "admin",
    bodyParams: [
      { name: "title",       type: "string", required: false, description: "Updated product name" },
      { name: "price",       type: "number", required: false, description: "Updated price" },
      { name: "description", type: "string", required: false, description: "Updated description" },
      { name: "category",    type: "string", required: false, description: "general | clothing | electronics | digital" },
      { name: "image",       type: "string", required: false, description: "Updated media document ID" },
      { name: "status",      type: "string", required: false, description: "published | draft" },
    ],
    responseExample: {
      success: true,
      data: { id: "abc123", title: "Updated Hoodie", price: 49.99, _status: "published", updatedAt: "2026-09-25T15:00:00Z" },
    },
    codeSnippets: {
      curl: `curl -X PATCH "${BASE}/api/products/abc123" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: payload-token=YOUR_SESSION_COOKIE" \\
  -d '{"price": 49.99, "status": "published"}'`,
      javascript: `const res = await fetch(\`/api/products/\${productId}\`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ price: 49.99, status: "published" }),
});
const { success, data } = await res.json();`,
      typescript: `const updates: Partial<{ title: string; price: number; status: "published" | "draft" }> = {
  price: 49.99,
  status: "published",
};
const res = await fetch(\`/api/products/\${productId}\`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updates),
});`,
      python: `import requests
r = requests.patch(
    f"${BASE}/api/products/{product_id}",
    json={"price": 49.99, "status": "published"},
    cookies={"payload-token": "YOUR_TOKEN"},
)
print(r.json())`,
      php: `<?php
$ch = curl_init("${BASE}/api/products/$productId");
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "PATCH",
    CURLOPT_POSTFIELDS => json_encode(["price" => 49.99, "status" => "published"]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json", "Cookie: payload-token=YOUR_TOKEN"],
]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
print_r($result);`,
    },
  },
  {
    id: "delete-product",
    method: "DELETE",
    path: "/api/products/:id",
    summary: "Delete Product",
    description: "Permanently delete a product by ID. This action is irreversible. Admin-only.",
    auth: "admin",
    queryParams: [
      { name: "id", type: "string", required: true, description: "Payload CMS document ID of the product to delete" },
    ],
    responseExample: {
      success: true,
      message: "Product 'abc123' deleted successfully.",
    },
    codeSnippets: {
      curl: `curl -X DELETE "${BASE}/api/products/abc123" \\
  -H "Cookie: payload-token=YOUR_SESSION_COOKIE"`,
      javascript: `const res = await fetch(\`/api/products/\${productId}\`, {
  method: "DELETE",
  credentials: "include",
});
const { success, message } = await res.json();
console.log(message);`,
      typescript: `const res = await fetch(\`/api/products/\${productId}\`, {
  method: "DELETE",
  credentials: "include",
});
const { success, message }: { success: boolean; message: string } = await res.json();`,
      python: `import requests
r = requests.delete(
    f"${BASE}/api/products/{product_id}",
    cookies={"payload-token": "YOUR_TOKEN"},
)
print(r.json())`,
      php: `<?php
$ch = curl_init("${BASE}/api/products/$productId");
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "DELETE",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Cookie: payload-token=YOUR_TOKEN"],
]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
echo $result["message"];`,
    },
  },
]

// ─────────────────────────────────────────────
//  CopyButton
// ─────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.12)",
        background: copied ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
        color: copied ? "#10b981" : "rgba(255,255,255,0.65)",
        transition: "all 0.15s ease",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

// ─────────────────────────────────────────────
//  ParamTable
// ─────────────────────────────────────────────

function ParamTable({ params, title }: { params: ApiParam[]; title: string }) {
  const thStyle: CSSProperties = {
    padding: "8px 12px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "var(--theme-elevation-500, #888)",
    backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.03))",
    borderBottom: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.07))",
    whiteSpace: "nowrap",
  }
  const tdStyle: CSSProperties = {
    padding: "8px 12px",
    fontSize: "12px",
    borderBottom: "1px solid var(--theme-elevation-75, rgba(0,0,0,0.05))",
    verticalAlign: "top",
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--theme-elevation-500,#888)", marginBottom: "8px" }}>
        {title}
      </div>
      <div style={{ border: "1px solid var(--theme-elevation-100,rgba(0,0,0,0.08))", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "420px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={{ ...thStyle, minWidth: "70px" }}>Type</th>
                <th style={{ ...thStyle, minWidth: "80px" }}>Required</th>
                <th style={{ ...thStyle, width: "100%" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p, i) => (
                <tr key={p.name} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "var(--theme-elevation-25, rgba(0,0,0,0.015))" }}>
                  <td style={tdStyle}>
                    <code style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "12px", color: "var(--theme-elevation-900,#111)" }}>{p.name}</code>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--theme-elevation-600,#666)" }}>{p.type}</td>
                  <td style={tdStyle}>
                    {p.required
                      ? <span style={{ color: "#dc2626", fontWeight: 700, fontSize: "11px" }}>Yes</span>
                      : <span style={{ color: "var(--theme-elevation-400,#aaa)", fontSize: "11px" }}>No</span>}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--theme-elevation-700,#555)", lineHeight: 1.5 }}>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  EndpointCard
// ─────────────────────────────────────────────

function EndpointCard({ ep }: { ep: ApiEndpoint }) {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<Language>("javascript")

  const mc = METHOD_COLORS[ep.method]
  const ai = AUTH_INFO[ep.auth]

  return (
    <div style={{
      borderRadius: "10px",
      border: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.09))",
      overflow: "hidden",
      marginBottom: "10px",
      boxShadow: open ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s ease",
    }}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
          padding: "14px 16px",
          background: open ? "var(--theme-elevation-50, rgba(0,0,0,0.03))" : "var(--theme-bg, #fff)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
      >
        {/* Method badge */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "62px",
          padding: "3px 8px",
          borderRadius: "6px",
          border: `1px solid ${mc.border}`,
          background: mc.bg,
          color: mc.text,
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          flexShrink: 0,
        }}>
          {ep.method}
        </span>

        {/* Path */}
        <code style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 600, color: "var(--theme-elevation-900,#111)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ep.path}
        </code>

        {/* Auth badge */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "20px",
          background: ai.bg,
          color: ai.text,
          fontSize: "11px",
          fontWeight: 600,
          flexShrink: 0,
        }}>
          <ShieldCheck size={11} />
          {ai.label}
        </span>

        {/* Summary (hidden on very small) */}
        <span style={{ fontSize: "12px", color: "var(--theme-elevation-500,#888)", flexShrink: 0, display: "none" }} className="ep-summary">
          {ep.summary}
        </span>

        {/* Chevron */}
        <span style={{ marginLeft: "auto", flexShrink: 0, color: "var(--theme-elevation-500,#888)" }}>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {/* Expanded body */}
      {open && (
        <div style={{ borderTop: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.08))" }}>
          {/* Description */}
          <div style={{ padding: "14px 16px 10px", background: "var(--theme-elevation-25, rgba(0,0,0,0.015))" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--theme-elevation-700,#555)", lineHeight: 1.6 }}>{ep.description}</p>
          </div>

          {/* Params */}
          {(ep.queryParams?.length || ep.bodyParams?.length) ? (
            <div style={{ padding: "14px 16px", borderTop: "1px solid var(--theme-elevation-75,rgba(0,0,0,0.05))" }}>
              {ep.queryParams && ep.queryParams.length > 0 && (
                <ParamTable
                  params={ep.queryParams}
                  title={ep.method === "GET" ? "Query / Path Parameters" : "Path Parameters"}
                />
              )}
              {ep.bodyParams && ep.bodyParams.length > 0 && (
                <ParamTable params={ep.bodyParams} title="Request Body (JSON)" />
              )}
            </div>
          ) : null}

          {/* Code snippets */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid var(--theme-elevation-75,rgba(0,0,0,0.05))" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--theme-elevation-500,#888)", marginBottom: "10px" }}>
              Code Example
            </div>

            {/* Language tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
              {(Object.keys(LANG_LABELS) as Language[]).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: lang === l ? "1px solid var(--theme-success-500,#0d9488)" : "1px solid var(--theme-elevation-100,rgba(0,0,0,0.09))",
                    background: lang === l ? "var(--theme-success-500,#0d9488)" : "var(--theme-elevation-50,rgba(0,0,0,0.03))",
                    color: lang === l ? "#fff" : "var(--theme-elevation-700,#555)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div style={{ borderRadius: "10px", background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{LANG_LABELS[lang]}</span>
                <CopyButton text={ep.codeSnippets[lang]} />
              </div>
              <pre style={{ overflowX: "auto", padding: "16px", margin: 0, fontSize: "12px", lineHeight: 1.7, color: "#e4e4e7", fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}>
                <code>{ep.codeSnippets[lang]}</code>
              </pre>
            </div>
          </div>

          {/* Response example */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid var(--theme-elevation-75,rgba(0,0,0,0.05))" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--theme-elevation-500,#888)", marginBottom: "10px" }}>
              Example Response
            </div>
            <div style={{ borderRadius: "10px", background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>JSON</span>
                <CopyButton text={JSON.stringify(ep.responseExample, null, 2)} />
              </div>
              <pre style={{ overflowX: "auto", padding: "16px", margin: 0, fontSize: "12px", lineHeight: 1.7, color: "#e4e4e7", fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}>
                <code>{JSON.stringify(ep.responseExample, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
//  Main View
// ─────────────────────────────────────────────

export function ApiReferenceView() {
  const [filter, setFilter] = useState<HttpMethod | "ALL">("ALL")

  const filtered = filter === "ALL" ? endpoints : endpoints.filter(e => e.method === filter)

  const filterBtnStyle = (m: HttpMethod | "ALL"): CSSProperties => {
    const active = filter === m
    if (m === "ALL") {
      return {
        padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
        border: active ? "1px solid var(--theme-success-500,#0d9488)" : "1px solid var(--theme-elevation-100,rgba(0,0,0,0.09))",
        background: active ? "var(--theme-success-500,#0d9488)" : "var(--theme-elevation-50,rgba(0,0,0,0.03))",
        color: active ? "#fff" : "var(--theme-elevation-700,#555)",
        transition: "all 0.15s ease",
      }
    }
    const mc = METHOD_COLORS[m as HttpMethod]
    return {
      padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
      border: active ? `1px solid ${mc.border}` : "1px solid var(--theme-elevation-100,rgba(0,0,0,0.09))",
      background: active ? mc.bg : "var(--theme-elevation-50,rgba(0,0,0,0.03))",
      color: active ? mc.text : "var(--theme-elevation-700,#555)",
      transition: "all 0.15s ease",
    }
  }

  return (
    <CustomAdminViewWrapper
      title="API Reference"
      badge="Products"
      description="Full REST API documentation for the Products system — with request URLs, parameters, and code examples in multiple languages."
    >
      {/* Info pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {[
          { icon: <Code2 size={13} />, text: "Base URL: /api/products" },
          { icon: <Zap size={13} />, text: "REST API · JSON" },
          { icon: <Package size={13} />, text: "Payload CMS Backend" },
          { icon: <BookOpen size={13} />, text: "5 Endpoints" },
        ].map(({ icon, text }) => (
          <span key={text} style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "4px 12px", borderRadius: "20px",
            border: "1px solid var(--theme-elevation-100,rgba(0,0,0,0.09))",
            background: "var(--theme-elevation-50,rgba(0,0,0,0.03))",
            fontSize: "12px", color: "var(--theme-elevation-600,#666)",
          }}>
            {icon}{text}
          </span>
        ))}
      </div>

      {/* Auth legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
        {Object.entries(AUTH_INFO).map(([key, a]) => (
          <div key={key} style={{
            flex: "1 1 200px",
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid var(--theme-elevation-100,rgba(0,0,0,0.08))",
            background: "var(--theme-bg,#fff)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <ShieldCheck size={13} color={a.text} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: a.text }}>{a.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--theme-elevation-600,#666)", lineHeight: 1.5 }}>{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--theme-elevation-500,#888)", marginRight: "4px" }}>Filter:</span>
        {(["ALL", "GET", "POST", "PATCH", "DELETE"] as const).map(m => (
          <button key={m} type="button" onClick={() => setFilter(m)} style={filterBtnStyle(m)}>{m}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--theme-elevation-500,#888)" }}>
          {filtered.length} endpoint{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Endpoint cards */}
      <div>
        {filtered.map(ep => <EndpointCard key={ep.id} ep={ep} />)}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "24px", padding: "16px 18px",
        borderRadius: "10px",
        border: "1px dashed var(--theme-elevation-150,rgba(0,0,0,0.1))",
        background: "var(--theme-elevation-25,rgba(0,0,0,0.015))",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
          <BookOpen size={14} />
          Additional Payload CMS APIs
        </div>
        {[
          ["/api/graphql",            "Full GraphQL API with all collections"],
          ["/api/graphql-playground", "Interactive GraphQL explorer"],
          ["/api/media",              "Upload and manage media files"],
          ["/api/categories",         "Product category management"],
          ["/api/users",              "User accounts (admin only)"],
        ].map(([path, desc]) => (
          <div key={path} style={{ fontSize: "12px", color: "var(--theme-elevation-600,#666)", marginBottom: "5px" }}>
            • <code style={{ fontFamily: "monospace", background: "var(--theme-elevation-75,rgba(0,0,0,0.05))", padding: "1px 6px", borderRadius: "4px", fontSize: "11px" }}>{path}</code>
            {" "}— {desc}
          </div>
        ))}
      </div>
    </CustomAdminViewWrapper>
  )
}

export default ApiReferenceView
