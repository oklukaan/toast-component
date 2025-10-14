Toast Web Component

Basit, framework-bağımsız Toast (bildirim) bileşeni.
Sıfır bağımlılık, tek dosya (Web Components / Custom Elements).

https://github.com/
<oklukaan>/<toast-component> (repo linkini sonra güncelle)

✨ Özellikler

⚡ Frameworksiz: Vanilla JS, Custom Elements

🎨 Modern UI: beyaz kart, sol renk şeridi, varyant ikonları

🧩 Varyantlar: type: "info" | "success" | "error" | "warning"

🖼️ Özel ikon: iconHTML (SVG/IMG/emoji) veya glyph (✓ ✕ i !)

♿ Erişilebilirlik: role="status", aria-live="polite", kapatma butonu

🧰 Esnek API: extraHTML, süre, genişlik/yükseklik, renk override

🧼 Temiz kapanış: auto-hide, manuel kapatma, event’ler


🧭 Hızlı Başlangıç

Dosyayı ekle

<script src="toast.js"></script>


Bileşeni HTML’e yerleştir

<toast-message id="myToast"></toast-message>

Kullan

<script>
  const t = document.querySelector('#myToast');

  // Success (otomatik ikon ve renk)
  t.show('Success', { type: 'success', extraHTML: 'Your changes are saved successfully.' });

  // Error
  t.show('Error', { type: 'error', extraHTML: 'Error has occurred while saving changes.' });

  // Info + özel ikon (SVG)
  t.show('Info', {
    type: 'info',
    iconHTML: '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">...</svg>',
    extraHTML: 'Hesabınızda yeni ayarlar var.'
  });
</script>

🧪 Demo (tam sayfa örnek)
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Toast Demo</title>
    <script src="toast.js"></script>
  </head>
  <body>
    <button id="ok">Success</button>
    <button id="err">Error</button>
    <button id="inf">Info (SVG)</button>

    <toast-message id="toast"></toast-message>

    <script>
      const toast = document.getElementById('toast');

      document.getElementById('ok').onclick = () => {
        toast.show('Saved', { type: 'success', extraHTML: 'Changes saved.' });
      };

      document.getElementById('err').onclick = () => {
        toast.show('Something went wrong', { type: 'error', extraHTML: 'Please try again.' });
      };

      document.getElementById('inf').onclick = () => {
        toast.show('Heads up', {
          type: 'info',
          iconHTML: '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="..."/></svg>',
          extraHTML: 'New settings available.'
        });
      };
    </script>
  </body>
</html>


🔌 API
t.show(message, options?)
Parametre	Tip	Varsayılan	Açıklama
message	string	—	Başlık / ana metin (kalın).
options.timeout	number	3000	Otomatik kapanma süresi (ms). 0 → otomatik kapanmaz.
options.type	"info" | "success" | "error" | "warning"	"info"	Varyant; renk/ikon setini seçer. info bazdır.
options.extraHTML	string	—	Alt açıklama alanına HTML içerik. (Link/metin vb.)
options.iconHTML	string	—	Varsayılan pseudo-ikon yerine özel ikon (SVG/IMG/emoji).
options.glyph	string	—	Pseudo-ikon metni (ör. "✓"). iconHTML yoksa kullanılır.
options.className	string | string[]	—	Ek CSS sınıfları (örn. kenar gölgesi varyasyonu).
options.color	string	—	Arka plan override (gerekmez; tasarım beyaz kart).
options.textColor	string	—	Metin rengi override.
options.width	string	auto	Genişlik.
options.height	string	auto	Yükseklik.
t.hide()

Mevcut toast’ı animasyonla kapatır.


🎛️ Davranış & Varyant Mantığı

Bileşen, show() çağrısında her zaman toast--info sınıfını ekler (baz tema).

type geçersen (success/error/warning), aynı anda o sınıfı da ekler.
CSS’te info kuralları önce, diğer varyantlar sonra tanımlandığı için renk/ikon doğru şekilde override edilir.

iconHTML verilirse, soldaki pseudo-ikon gizlenir ve slot’a yerleştirilen ikon görünür.

glyph verirsen, pseudo-ikonun içeriği güncellenir (örn. "✓").

🧩 Etkinlikler

Bileşen dışarıya iki CustomEvent yayınlar:

toast:show – { detail: { message, options } }

toast:hide – detail yok

Kullanım:

toast.addEventListener('toast:show', (e) => {
  console.log('Toast opened:', e.detail);
});
toast.addEventListener('toast:hide', () => {
  console.log('Toast closed');
});

♿ Erişilebilirlik

role="status" + aria-live="polite": ekran okuyucular yeni mesajı duyurur.

Kapatma butonu aria-label="close" ile etiketlenir.

Açık/kapalı durumda aria-hidden güncellenir.

İpucu: Çok sık arka arkaya toast göstereceksen, okuma deneyimini boğmamak için timeout değerlerini ayarla.

🎨 Stil & Tema

Bileşen, CSS custom property’ler ile tema alır:

--accent (sol şerit ve ikon rengi)

--glyph (pseudo-ikon içerik metni; tırnak içinde string)

Varsayılan (info) tema .toast’ta; varyantlar override eder:

.toast{ --accent:#3b82f6; --glyph:"i"; } /* default (info) */
.toast.toast--success{ --accent:#22c55e; --glyph:"✓"; }
.toast.toast--error  { --accent:#ef4444; --glyph:"✕"; }
.toast.toast--warning{ --accent:#f59e0b; --glyph:"!"; }


Kapsayıcıdan temayı değiştirmek istersen:

toast-message .toast { --accent: #8b5cf6; } /* mor accent */


Not: Pseudo-ikon yerine kendi ikonun için iconHTML kullan; pseudo-ikon otomatik gizlenir.

🧱 Konumlandırma

Varsayılan olarak sağ-üst (top: 20px; right: 20px;).
Farklı bir konum istersen .toast stilindeki top/right’ı override et:

toast-message .toast { top: auto; bottom: 20px; right: 20px; }


Şu an tek örnek toast gösterimi için tasarlandı. Birden fazla toast’ı istiflemek istersen, bir queue/stack davranışı ekleyebilirsin (geliştirme notlarına bak).

🧱 Tarayıcı Desteği

Modern tarayıcılar (Chrome, Edge, Firefox, Safari).

Web Components desteklemeyen eski tarayıcılar için polyfill gerekebilir.

🧩 Geliştirme Notları / Yol Haritası

 Çoklu toast desteği (stack & kuyruğa alma)

 Ekranın farklı köşeleri için API (position: 'top-right' | ...)

 Klavye kısayolu ile kapama (ESC)

 Auto-pause on hover (fare üzerindeyken süreyi durdur)

📝 Lisans

MIT © 2025 Kaan Okluçam


🙌 Katkı

PR’ler/issue’lar hoş gelir.
İsimlendirme/tema iyileştirmeleri veya stack davranışı için öneri açabilirsin.


🔍 SSS

Neden hem toast--info hem de toast--success kullanılıyor?
info baz temayı (beyaz kart, layout) temsil eder; success/error/warning sadece --accent ve --glyph gibi değişkenleri override eder. Bu sayede sıraya bağlı hatalar önlenir.

Kendi ikonumu nasıl kullanırım?
iconHTML ile bir SVG/IMG/emoji geçir. Pseudo-ikon otomatik gizlenir:

t.show('Saved', { type:'success', iconHTML:'<svg ...>...</svg>' });
