import { useState } from "react";

const ButtonCopyPaste = () => {
  const [copied, setCopied] = useState(false);

  function copyStyledDiv(): void {
    const element = document.querySelector(".div-result") as HTMLElement | null;

    if (!element) {
      alert("Élément '.div-result' introuvable.");
      return;
    }

    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      alert("Clipboard API non supportée.");
      return;
    }

    const html: string = element.innerHTML;
    const text: string = element.innerText.slice(3);
    console.log(html);
    console.log(text);

    const htmlBlob = new Blob([html], { type: "text/html" });
    const textBlob = new Blob([text], { type: "text/plain" });

    console.log(htmlBlob);
    console.log(textBlob);

    const item = new ClipboardItem({
      "text/html": htmlBlob,
      "text/plain": textBlob,
    });

    navigator.clipboard
      .write([item])
      .then(() => {
        setCopied(true);
        // Remettre à false après 2 secondes
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err: unknown) => {
        console.error("Erreur de copie :", err);
      });
  }

  return (
    <button
      className="copy-btn"
      onClick={copyStyledDiv}
      title={copied ? "Copié !" : "Copier la recette"}
      aria-live="polite"
    >
      {copied ? "✅" : "📋"}
    </button>
  );
};

export default ButtonCopyPaste;
