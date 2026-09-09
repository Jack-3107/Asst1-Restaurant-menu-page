(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.querySelector('#loader');
  const progress = document.querySelector('#loader-progress');

  let progressValue = 0;
  const progressTimer = window.setInterval(() => {
    progressValue = Math.min(progressValue + (progressValue < 75 ? 7 : 2), 100);
    if (progress) progress.style.width = `${progressValue}%`;
    if (progressValue === 100) window.clearInterval(progressTimer);
  }, 55);

  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('is-done'), reducedMotion ? 0 : 500);
  }, { once: true });

  document.querySelectorAll('.section-heading, .design-statement, .performance-content, .engine-content, .interior-content, .night-content, .rotation-heading, .configurator-header, .final-content').forEach((element) => {
    element.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const animateNumber = (element) => {
    const target = Number(element.dataset.value);
    if (!Number.isFinite(target)) return;
    if (reducedMotion) {
      element.textContent = target;
      return;
    }
    const startedAt = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        numberObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('.performance-number .number').forEach((number) => numberObserver.observe(number));

  const canvasColors = ['rgba(225, 38, 45, .22)', 'rgba(255, 255, 255, .12)', 'rgba(120, 130, 140, .14)'];
  const animatedCanvases = document.querySelectorAll('canvas');
  animatedCanvases.forEach((canvas, index) => {
    const context = canvas.getContext('2d');
    if (!context) return;
    let frame = 0;
    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = window.devicePixelRatio || 1;
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.scale(ratio, ratio);
      }
      context.clearRect(0, 0, width, height);
      const centerX = width * (index % 2 ? .54 : .62);
      const centerY = height * .56;
      const pulse = reducedMotion ? 0 : Math.sin(frame / 80) * 12;
      const glow = context.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(width, height) * .5);
      glow.addColorStop(0, canvasColors[index % canvasColors.length]);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.save();
      context.translate(centerX, centerY + pulse);
      context.rotate(-.08);
      context.strokeStyle = index === 0 ? 'rgba(225, 38, 45, .42)' : 'rgba(255, 255, 255, .15)';
      context.lineWidth = 1;
      for (let line = 0; line < 10; line += 1) {
        context.beginPath();
        context.ellipse(0, 0, width * (.18 + line * .025), height * (.08 + line * .012), 0, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
      frame += 1;
      if (!reducedMotion) window.requestAnimationFrame(draw);
    };
    draw();
  });

  document.querySelectorAll('.color-option').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.color-options')?.querySelectorAll('.color-option').forEach((option) => option.classList.remove('active'));
      button.classList.add('active');
      const preview = document.querySelector('.configurator-preview');
      const colors = {
        'color-white': ['#c7c7c2', '#787873'],
        'color-black': ['#525252', '#090909'],
        'color-red': ['#9c1f25', '#170707'],
        'color-grey': ['#949a9c', '#323638']
      };
      const selected = Object.keys(colors).find((name) => button.classList.contains(name));
      if (preview && selected) preview.style.background = `radial-gradient(ellipse at 50% 50%, ${colors[selected][0]}, ${colors[selected][1]} 55%, #171717)`;
    });
  });

  document.querySelectorAll('.option-row').forEach((row) => {
    row.querySelectorAll('.text-option').forEach((button) => button.addEventListener('click', () => {
      row.querySelectorAll('.text-option').forEach((option) => option.classList.remove('active'));
      button.classList.add('active');
    }));
  });

  document.querySelectorAll('.rotation-control').forEach((button) => button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('.rotation-control').forEach((control) => control.classList.remove('active'));
    button.classList.add('active');
  }));

  document.querySelectorAll('.hotspot').forEach((button) => button.addEventListener('click', () => {
    button.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 350 });
  }));

  document.querySelector('.build-button')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const originalLabel = button.firstChild;
    if (originalLabel) originalLabel.textContent = ' GT SAVED ';
    button.style.background = '#303632';
    window.setTimeout(() => {
      if (originalLabel) originalLabel.textContent = ' SAVE MY GT ';
      button.style.background = '';
    }, 1800);
  });
})();
