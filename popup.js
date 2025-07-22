// =======================
// 🤖 Cyber Sakhi: popup.js
// =======================

const tips = [
  "💡 Don't share your real name online!",
  "🛡️ Never click on suspicious links.",
  "👀 Don't talk to strangers on the internet.",
  "🔑 Don't share passwords, not even with friends.",
  "📍 Turn off location sharing if not needed.",
  "📸 Don’t share personal photos.",
  "🧠 Think before you click!",
  "👨‍👩‍👧 Ask a trusted adult if you're unsure."
];

const quiz = [
  {
    question: "What should you do if someone online asks for your school name?",
    options: ["Tell them quickly", "Ignore them", "Ask a teacher first"],
    correct: 2
  },
  {
    question: "Is it safe to click links from strangers?",
    options: ["Yes", "No", "Only if colorful"],
    correct: 1
  }
];

const riskyDomains = [
  "omegle.com",
  "randomchat.com",
  "webcammictest.com",
  "whatismyipaddress.com",
  "mycurrentlocation.net"
];

const riskyKeywords = [
  "allow camera", "share location", "enable microphone", "give mic access",
  "record audio", "start recording", "enable webcam", "use your microphone",
  "use your camera", "allow access to", "join with mic", "click allow"
];

document.addEventListener("DOMContentLoaded", () => {
  // Show random tip
  document.getElementById("dailyTip").textContent =
    tips[Math.floor(Math.random() * tips.length)];

  // Help button alert
  document.getElementById("helpButton").addEventListener("click", () => {
    alert("📞 Cyber Tip:\nAsk a trusted adult or teacher if you're unsure.\nStay safe online!");
  });

  // Quiz
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const selectedQuiz = quiz[Math.floor(Math.random() * quiz.length)];

  quizQuestion.textContent = selectedQuiz.question;
  selectedQuiz.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.textContent = option;
    btn.onclick = () => {
      if (index === selectedQuiz.correct) {
        quizFeedback.textContent = "✅ Correct!";
        quizFeedback.style.color = "green";
      } else {
        quizFeedback.textContent = "❌ Try again!";
        quizFeedback.style.color = "darkred";
      }
    };
    quizOptions.appendChild(btn);
  });

  // SCAN button
  document.getElementById("scanBtn").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.textContent = "🔎 Scanning site...";

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname.toLowerCase();
    const isRisky = riskyDomains.some(d => domain.includes(d));

    if (isRisky) {
      alert("🚨 Cyber Sakhi Warning:\nThis site is known to collect sensitive data like camera/mic/location.");
      status.textContent = "🚨 Risky domain detected!";
      return;
    }

    // Inject code directly into page to scan for risky keywords
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (keywords) => {
        const bodyText = document.body.innerText.toLowerCase();
        for (let word of keywords) {
          if (bodyText.includes(word)) return word;
        }
        return null;
      },
      args: [riskyKeywords]
    }, (results) => {
      const detected = results && results[0].result;
      if (detected) {
        alert(`⚠️ Suspicious content detected:\n"${detected}"`);
        status.textContent = `⚠️ Keyword detected: "${detected}"`;
      } else {
        alert("✅ All clear!\nThis site looks safe. Stay cyber smart!");
        status.textContent = "✅ No privacy risks detected.";
      }
    });
  });
});
