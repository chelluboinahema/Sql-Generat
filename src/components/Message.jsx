const extractContent = (payload) => {
  if (payload == null) return "";

  if (typeof payload !== "string") {
    return (
      payload.sql ||
      payload.response ||
      payload.output ||
      payload.message ||
      JSON.stringify(payload, null, 2)
    );
  }

  const text = payload.trim();
  if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
    try {
      const parsed = JSON.parse(text);
      return extractContent(parsed);
    } catch {
      // not JSON, fall back to plain string
    }
  }

  return text;
};

const parseMessage = (text) => {
  const raw = extractContent(text);
  const codeBlockRegex = /```(?:\w*)\n([\s\S]*?)```/;
  const match = raw.match(codeBlockRegex);

  if (match) {
    const code = match[1].trim();
    const explanation = raw.slice(match.index + match[0].length).trim();
    const blocks = [{ type: "code", content: code }];

    if (explanation) {
      blocks.push({ type: "text", content: explanation });
    }

    return blocks;
  }

  return [{ type: "text", content: raw.trim() }];
};

const parseInlineMarkdown = (text) => {
  const tokenRegex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (/^\*\*(.+)\*\*$/.test(part) || /^__(.+)__$/.test(part)) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold">
          {content}
        </strong>
      );
    }

    if (/^\*(.+)\*$/.test(part) || /^_(.+)_$/.test(part)) {
      const content = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {content}
        </em>
      );
    }

    return part;
  });
};

const renderTextBlock = (text, key) => {
  const lines = text.split(/\r?\n/);
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}-${elements.length}`} className="list-disc pl-6 space-y-1 text-slate-200">
          {listItems.map((item, index) => (
            <li key={index} className="leading-7">
              {item}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (/^([-*])\s+/.test(trimmed)) {
      listItems.push(parseInlineMarkdown(trimmed.replace(/^([-*])\s+/, "")));
      return;
    }

    flushList();

    if (/^#{1,6}\s+/.test(trimmed)) {
      const level = trimmed.match(/^#{1,6}/)[0].length;
      const content = trimmed.replace(/^#{1,6}\s+/, "");
      const Tag = `h${Math.min(level, 3)}`;
      elements.push(
        <Tag key={`${key}-${index}`} className="text-slate-100 font-semibold mt-4 mb-2">
          {parseInlineMarkdown(content)}
        </Tag>,
      );
      return;
    }

    if (trimmed === "") {
      elements.push(<div key={`${key}-${index}`} className="my-3" />);
      return;
    }

    elements.push(
      <p key={`${key}-${index}`} className="whitespace-pre-wrap text-slate-200 leading-7">
        {parseInlineMarkdown(trimmed)}
      </p>,
    );
  });

  flushList();
  return elements;
};

export default function Message({ question, answer }) {
  const blocks = parseMessage(answer);

  return (
    <div className="mb-8">
      <div className="flex justify-end">
        <div className="rounded-3xl px-6 py-4 max-w-[60%] bg-primary text-white shadow-lg shadow-primary/20">
          {question}
        </div>
      </div>

      <div className="mt-4">
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-cyan-900 rounded-3xl p-6 ring-1 ring-primary/20 shadow-lg shadow-cyan-500/15 border border-cyan-400/10">
          {blocks.map((block, index) =>
            block.type === "code" ? (
              <pre key={index} className="whitespace-pre-wrap bg-slate-800 text-slate-100 rounded-2xl p-4 overflow-x-auto shadow-sm">
                {block.content}
              </pre>
            ) : (
              <div key={index}>{renderTextBlock(block.content, index)}</div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
