/* FAST TRACK MOTORS — shared interactions */
(function(){
  // header scroll state
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // mobile menu
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.nav-menu');
  if(burger){
    burger.addEventListener('click', ()=>{
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
      burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow='';
    }));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));

  // counters
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const cio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec||'0');
        const dur = 1500; const t0 = performance.now();
        const tick = (now)=>{
          const p = Math.min(1,(now-t0)/dur);
          const eased = 1-Math.pow(1-p,3);
          const val = target*eased;
          el.textContent = dec ? val.toFixed(dec) : Math.round(val).toLocaleString();
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, {threshold:0.5});
    counters.forEach(c=>cio.observe(c));
  }

  // hero parallax (subtle, desktop only)
  const heroImg = document.querySelector('[data-parallax]');
  if(heroImg && window.matchMedia('(min-width:981px)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y < 800) heroImg.style.transform = `translateY(${y*0.08}px) scale(1.05)`;
    }, {passive:true});
  }

  // FAQ accordion
  document.querySelectorAll('[data-faq]').forEach(item=>{
    const q = item.querySelector('.faq-q');
    q && q.addEventListener('click', ()=>{
      const open = item.classList.contains('open');
      document.querySelectorAll('[data-faq].open').forEach(o=>{ if(o!==item){o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=null;} });
      item.classList.toggle('open');
      const a = item.querySelector('.faq-a');
      a.style.maxHeight = open ? null : a.scrollHeight + 'px';
    });
  });
})();
