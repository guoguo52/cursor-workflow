/* 《白衬衫》政府展示全案站交互 */
(() => {
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => {
    nav.classList.toggle("is-solid", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => {
        t.setAttribute("aria-selected", String(t === tab));
      });
      document.querySelectorAll(".asset-panel").forEach((panel) => {
        panel.hidden = panel.id !== `panel-${id}`;
      });
    });
  });

  const counts = { scene: 16, character: 19, prop: 13 };
  const labels = {
    scene: (i) => (i === 16 ? "SC-REU-01 四宫格" : `场景概念 ${String(i).padStart(2, "0")}`),
    character: (i) => {
      const map = {
        1: "CH-001 陈云峰 · 考公少年",
        2: "CH-001 陈云峰 · 入职白衬衫",
        3: "CH-001 陈云峰 · 堕落期西装",
        5: "CH-002 苏晚 · 校园 Look（旧档）",
        9: "云峰二叔",
        14: "CH-REU-06 女同学己",
        15: "CH-REU-05 女同学戊",
        16: "CH-002 苏晚 Look_Reunion（旧档）",
        17: "EX-REU-01 群演包",
        19: "同学甲乙丙丁群像",
      };
      return map[i] || `角色定妆 ${String(i).padStart(2, "0")}`;
    },
    prop: (i) => (i === 13 ? "PR-REU-01 红酒杯" : `道具规格 ${String(i).padStart(2, "0")}`),
  };

  const featuredSuWan = [
    { src: "assets/web/character/suwan_reunion.jpg", cap: "CH002-B 苏晚 · 同学会素裙" },
    { src: "assets/web/character/suwan_campus.jpg", cap: "CH002-A 苏晚 · 校园清纯期" },
  ];

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("lightboxClose");

  function openLightbox(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap;
    lbCap.textContent = cap;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    setTimeout(() => {
      lb.hidden = true;
      lbImg.src = "";
    }, 280);
  }

  lbClose?.addEventListener("click", closeLightbox);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  const vlb = document.getElementById("videoLightbox");
  const vlbPlayer = document.getElementById("videoLightboxPlayer");
  const vlbCap = document.getElementById("videoLightboxCap");
  const vlbClose = document.getElementById("videoLightboxClose");

  function openVideoLightbox(src, cap) {
    if (!vlb || !vlbPlayer) return;
    vlbPlayer.src = src;
    vlbCap.textContent = cap || "";
    vlb.hidden = false;
    requestAnimationFrame(() => vlb.classList.add("is-open"));
    vlbPlayer.play?.().catch(() => {});
  }

  function closeVideoLightbox() {
    if (!vlb) return;
    vlb.classList.remove("is-open");
    setTimeout(() => {
      vlb.hidden = true;
      if (vlbPlayer) {
        vlbPlayer.pause();
        vlbPlayer.removeAttribute("src");
        vlbPlayer.load();
      }
    }, 280);
  }

  vlbClose?.addEventListener("click", closeVideoLightbox);
  vlb?.addEventListener("click", (e) => {
    if (e.target === vlb) closeVideoLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (vlb && !vlb.hidden) closeVideoLightbox();
      else if (lb && !lb.hidden) closeLightbox();
    }
  });

  /* 成片 / 分镜素材 */
  const clipRail = document.getElementById("clipRail");
  const clipCountLabel = document.getElementById("clipCountLabel");
  fetch("assets/video/manifest.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data) return;
      const clips = data.clips || [];
      if (clipCountLabel) {
        clipCountLabel.textContent = `${clips.length} 条节点成片（去重后）· 横向滚动 · 点击全屏播放`;
      }
      if (clipRail) {
        clips.forEach((c) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "rail-card";
          btn.innerHTML = `
            <video class="clip-thumb" src="${c.file}" muted preload="metadata" playsinline></video>
            <span class="play-hint" aria-hidden="true">▶</span>
            <span class="meta"><strong>${c.label}</strong><span>节点 ${c.node} · ${(c.bytes / 1e6).toFixed(1)} MB</span></span>`;
          btn.addEventListener("click", () => openVideoLightbox(c.file, c.label));
          clipRail.appendChild(btn);
        });
        const step = () => Math.min(clipRail.clientWidth * 0.8, 640);
        document.getElementById("clipPrev")?.addEventListener("click", () => {
          clipRail.scrollBy({ left: -step(), behavior: "smooth" });
        });
        document.getElementById("clipNext")?.addEventListener("click", () => {
          clipRail.scrollBy({ left: step(), behavior: "smooth" });
        });
      }
      const stills = data.stills || [];
      const stillRow = document.getElementById("stillRow");
      const stillGrid = document.getElementById("stillGrid");
      if (stills.length && stillRow && stillGrid) {
        stillRow.hidden = false;
        stills.forEach((s) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.innerHTML = `<img src="${s.file}" alt="${s.label}" loading="lazy" /><span>${s.label}</span>`;
          btn.addEventListener("click", () => openLightbox(s.file, s.label));
          stillGrid.appendChild(btn);
        });
      }
    })
    .catch(() => {});

  Object.entries(counts).forEach(([kind, n]) => {
    const root = document.querySelector(`[data-gallery="${kind}"]`);
    if (!root) return;
    if (kind === "character") {
      featuredSuWan.forEach(({ src, cap }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-item";
        btn.innerHTML = `<img src="${src}" alt="${cap}" loading="lazy" /><span class="tag">${cap}</span>`;
        btn.addEventListener("click", () => openLightbox(src, cap));
        root.appendChild(btn);
      });
    }
    for (let i = 1; i <= n; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      const src = `assets/web/${kind}/${kind}_${String(i).padStart(2, "0")}.jpg`;
      const cap = labels[kind](i);
      btn.innerHTML = `<img src="${src}" alt="${cap}" loading="lazy" /><span class="tag">${cap}</span>`;
      btn.addEventListener("click", () => openLightbox(src, cap));
      root.appendChild(btn);
    }
  });

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => {
      openLightbox(el.dataset.lightbox, el.dataset.cap || "");
    });
  });

  const rail = document.getElementById("deliverRail");
  if (rail) {
    const kindLabel = { character: "角色", scene: "场景", prop: "道具" };
    featuredSuWan.forEach(({ src, cap }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rail-card";
      btn.innerHTML = `<img src="${src}" alt="${cap}" loading="lazy" /><span class="meta"><strong>${cap}</strong><span>角色 · 定妆真源</span></span>`;
      btn.addEventListener("click", () => openLightbox(src, cap));
      rail.appendChild(btn);
    });
    const order = [
      ...Array.from({ length: counts.character }, (_, i) => ["character", i + 1]),
      ...Array.from({ length: counts.scene }, (_, i) => ["scene", i + 1]),
      ...Array.from({ length: counts.prop }, (_, i) => ["prop", i + 1]),
    ];
    order.forEach(([kind, i]) => {
      const src = `assets/web/${kind}/${kind}_${String(i).padStart(2, "0")}.jpg`;
      const cap = labels[kind](i);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rail-card";
      btn.innerHTML = `<img src="${src}" alt="${cap}" loading="lazy" /><span class="meta"><strong>${cap}</strong><span>${kindLabel[kind]} · ${String(i).padStart(2, "0")}</span></span>`;
      btn.addEventListener("click", () => openLightbox(src, cap));
      rail.appendChild(btn);
    });

    const step = () => Math.min(rail.clientWidth * 0.8, 640);
    document.getElementById("railPrev")?.addEventListener("click", () => {
      rail.scrollBy({ left: -step(), behavior: "smooth" });
    });
    document.getElementById("railNext")?.addEventListener("click", () => {
      rail.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
