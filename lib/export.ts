/**
 * Export utilities for conversations and documents
 */

export interface ExportableMessage {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  timestamp?: string;
}

export interface ExportableConversation {
  title: string;
  messages: ExportableMessage[];
  createdAt?: string;
  exportedAt: string;
}

/**
 * Export conversation as plain text
 */
export function exportConversationAsText(
  conversation: ExportableConversation
): string {
  let text = `DocQuery Conversation Export\n`;
  text += `Title: ${conversation.title}\n`;
  if (conversation.createdAt) {
    text += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
  }
  text += `Exported: ${new Date(conversation.exportedAt).toLocaleString()}\n`;
  text += `\n${"=".repeat(60)}\n\n`;

  conversation.messages.forEach((message, index) => {
    text += `[${message.role.toUpperCase()}]\n`;
    text += `${message.content}\n`;

    if (message.citations && message.citations.length > 0) {
      text += `\nSources:\n`;
      message.citations.forEach((citation, i) => {
        text += `  ${i + 1}. ${citation}\n`;
      });
    }

    if (message.timestamp) {
      text += `\nTime: ${new Date(message.timestamp).toLocaleString()}\n`;
    }

    text += `\n${"-".repeat(60)}\n\n`;
  });

  return text;
}

/**
 * Export conversation as Markdown
 */
export function exportConversationAsMarkdown(
  conversation: ExportableConversation
): string {
  let markdown = `# ${conversation.title}\n\n`;

  if (conversation.createdAt) {
    markdown += `**Created:** ${new Date(
      conversation.createdAt
    ).toLocaleString()}\n`;
  }
  markdown += `**Exported:** ${new Date(
    conversation.exportedAt
  ).toLocaleString()}\n\n`;
  markdown += `---\n\n`;

  conversation.messages.forEach((message) => {
    const roleLabel = message.role === "user" ? "You" : "DocQuery";
    markdown += `## ${roleLabel}\n\n`;
    markdown += `${message.content}\n\n`;

    if (message.citations && message.citations.length > 0) {
      markdown += `**Sources:**\n`;
      message.citations.forEach((citation) => {
        markdown += `- ${citation}\n`;
      });
      markdown += `\n`;
    }

    if (message.timestamp) {
      markdown += `*${new Date(message.timestamp).toLocaleString()}*\n\n`;
    }

    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Download text as file
 */
export function downloadTextAsFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
