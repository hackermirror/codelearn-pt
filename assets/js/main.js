// Codelearn Portugal — interações do site (sem dependências)
(function () {
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  // ?shot desativa as animações (útil para capturas de ecrã)
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]shot\b/.test(location.search);
  if (reduceMotion) doc.classList.add("still");

  // Menu móvel
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Linha por baixo do cabeçalho ao rolar
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Aparecer ao rolar
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Editor de código do hero: escreve programas curtos em várias linguagens
  var editor = document.querySelector("[data-editor]");
  if (editor) {
    var code = editor.querySelector("pre code");
    var out = editor.querySelector(".editor-out");
    var file = editor.querySelector(".file");
    var tabs = editor.querySelectorAll(".editor-tabs span");
    // Cada programa é uma lista de [classe, texto]; classe vazia = texto normal
    var programs = [
      {
        file: "aventura.py",
        out: "Agustí ganhou 3 cristais! ✨",
        tokens: [
          ["c", "# Ajuda o Agustí a apanhar os cristais\n"],
          ["k", "def "], ["f", "recolher"], ["", "(mapa):\n"],
          ["", "    cristais = "], ["n", "0"], ["", "\n"],
          ["k", "    for "], ["", "casa "], ["k", "in "], ["", "mapa:\n"],
          ["k", "        if "], ["", "casa == "], ["s", "\"💎\""], ["", ":\n"],
          ["", "            cristais += "], ["n", "1"], ["", "\n"],
          ["k", "    return "], ["", "cristais\n\n"],
          ["f", "print"], ["", "("], ["s", "f\"Agustí ganhou {"], ["f", "recolher"], ["s", "(mapa)} cristais!\""], ["", ")"]
        ]
      },
      {
        file: "tartaruga.logo",
        out: "Desenhaste uma estrela ⭐",
        tokens: [
          ["c", "; A tartaruga desenha uma estrela\n"],
          ["k", "repete "], ["n", "5"], ["", " [\n"],
          ["f", "  avança "], ["n", "120"], ["", "\n"],
          ["f", "  direita "], ["n", "144"], ["", "\n"],
          ["", "]\n"],
          ["f", "escondetartaruga"]
        ]
      },
      {
        file: "padroes.py",
        out: "O próximo é 48 🧠",
        tokens: [
          ["c", "# Descobre o padrão: 3, 6, 12, 24, ?\n"],
          ["", "sequencia = ["], ["n", "3"], ["", ", "], ["n", "6"], ["", ", "], ["n", "12"], ["", ", "], ["n", "24"], ["", "]\n\n"],
          ["c", "# Cada número é o dobro do anterior\n"],
          ["", "proximo = sequencia[-"], ["n", "1"], ["", "] * "], ["n", "2"], ["", "\n\n"],
          ["f", "print"], ["", "("], ["s", "\"O próximo é\""], ["", ", proximo)"]
        ]
      }
    ];

    var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
    var render = function (tokens, upto) {
      var html = "", left = upto;
      for (var i = 0; i < tokens.length && left > 0; i++) {
        var t = tokens[i][1].slice(0, left);
        left -= t.length;
        html += tokens[i][0] ? '<span class="' + tokens[i][0] + '">' + esc(t) + "</span>" : esc(t);
      }
      return html;
    };
    var total = function (tokens) { return tokens.reduce(function (n, t) { return n + t[1].length; }, 0); };

    var idx = 0;
    var play = function () {
      var p = programs[idx];
      var len = total(p.tokens);
      file.textContent = p.file;
      tabs.forEach(function (t, i) { t.classList.toggle("on", i === idx); });
      out.textContent = "";
      if (reduceMotion) {
        code.innerHTML = render(p.tokens, len);
        out.textContent = p.out;
        return;
      }
      var plain = p.tokens.map(function (t) { return t[1]; }).join("");
      var n = 0;
      var tick = function () {
        n += 1;
        code.innerHTML = render(p.tokens, n) + '<span class="cursor"></span>';
        if (n < len) {
          // Pausa um pouco mais no fim de cada linha, como quem pensa
          setTimeout(tick, plain[n - 1] === "\n" ? 160 : 24 + Math.random() * 40);
        } else {
          setTimeout(function () { out.textContent = p.out; }, 450);
          setTimeout(function () { idx = (idx + 1) % programs.length; play(); }, 4200);
        }
      };
      tick();
    };
    play();
  }

  // Alternar faturação mensal / anual
  var billing = document.querySelectorAll("[data-billing]");
  if (billing.length) {
    var setBilling = function (mode) {
      billing.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.billing === mode ? "true" : "false"); });
      document.querySelectorAll("[data-price-monthly]").forEach(function (el) {
        el.textContent = mode === "anual" ? el.dataset.priceYearly : el.dataset.priceMonthly;
      });
      document.querySelectorAll("[data-note-monthly]").forEach(function (el) {
        el.textContent = mode === "anual" ? el.dataset.noteYearly : el.dataset.noteMonthly;
      });
    };
    billing.forEach(function (b) {
      b.addEventListener("click", function () { setBilling(b.dataset.billing); });
    });
  }

  // Citações rotativas
  var rot = document.querySelector(".quotes-rotator");
  if (rot) {
    var figs = rot.querySelectorAll("figure");
    var dotsWrap = document.querySelector(".rotator-dots");
    var cur = 0, timer;
    var show = function (i) {
      figs[cur].classList.remove("on");
      dotsWrap.children[cur].classList.remove("on");
      cur = i;
      figs[cur].classList.add("on");
      dotsWrap.children[cur].classList.add("on");
    };
    figs.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Citação " + (i + 1));
      if (i === 0) b.classList.add("on");
      b.addEventListener("click", function () { show(i); clearInterval(timer); });
      dotsWrap.appendChild(b);
    });
    if (!reduceMotion) timer = setInterval(function () { show((cur + 1) % figs.length); }, 7000);
  }

  // Formulário de contacto: envia para o mesmo processo de leads de codelearn.cat (âmbito Central)
  var lead = document.getElementById("lead-form");
  if (lead) {
    var status = lead.querySelector(".form-status");
    var siteKey = lead.dataset.recaptcha;
    var recaptchaLoaded = false;
    // O reCAPTCHA só se carrega quando a pessoa começa a preencher o formulário
    var loadRecaptcha = function () {
      if (recaptchaLoaded || !siteKey) return;
      recaptchaLoaded = true;
      var s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=" + siteKey;
      s.async = true;
      document.head.appendChild(s);
    };
    lead.addEventListener("focusin", loadRecaptcha);

    var setField = function (name, value) { lead.querySelector('[name="' + name + '"]').value = value; };
    var recaptchaError = function (code) {
      setField("recaptcha_error", code);
      setField("recaptcha_error_context", JSON.stringify({ code: code, user_agent: navigator.userAgent || "", language: navigator.language || "" }));
    };
    var getToken = function () {
      return new Promise(function (resolve) {
        if (typeof grecaptcha === "undefined") { recaptchaError("grecaptcha_undefined"); return resolve(); }
        grecaptcha.ready(function () {
          grecaptcha.execute(siteKey, { action: "contact_form" })
            .then(function (token) { setField("recaptcha_token", token); resolve(); })
            .catch(function () { recaptchaError("grecaptcha_execute_failed"); resolve(); });
        });
      });
    };

    var validate = function () {
      var ok = true;
      lead.querySelectorAll("[required]").forEach(function (el) {
        var valid = el.type === "checkbox" ? el.checked : el.checkValidity() && el.value.trim() !== "";
        (el.closest(".field") || el.closest(".check")).classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      return ok;
    };

    lead.addEventListener("submit", function (e) {
      e.preventDefault();
      if (lead.dataset.sending) return;
      status.className = "form-status";
      if (!validate()) {
        status.textContent = "Falta preencher alguns campos.";
        status.classList.add("ko");
        return;
      }
      lead.dataset.sending = "1";
      var btn = lead.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = "A enviar…";

      getToken().then(function () {
        var data = new URLSearchParams(new FormData(lead));
        // A idade não existe no processo de leads: junta-se à mensagem
        var age = document.getElementById("contact_age").value.trim();
        if (age) data.set("notes", "Idade do aluno: " + age + "\n\n" + data.get("notes"));
        return fetch(lead.dataset.endpoint, { method: "POST", body: data });
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        lead.innerHTML = '<div class="form-sent"><div class="icon bg-lime">✓</div><h3>Recebemos a tua mensagem!</h3><p>Vamos responder-te o mais depressa possível.</p></div>';
        if (typeof gtag === "function") gtag("event", "generate_lead", {});
        if (typeof fbq === "function") fbq("track", "Lead");
      }).catch(function () {
        delete lead.dataset.sending;
        btn.disabled = false;
        status.className = "form-status ko";
        status.innerHTML = 'Houve um erro ao enviar. Tenta outra vez ou escreve-nos para <a href="mailto:info@codelearn.pt">info@codelearn.pt</a>.';
      });
    });
  }

  // Ano no rodapé
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
