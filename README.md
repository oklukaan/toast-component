Toast Web Component

Frameworksüz, tek dosyalık toast (bildirim) bileşeni.
Vanilla JS + Web Components, sıfır bağımlılık.

Kurulum
<script src="toast.js"></script>
<toast-message id="toast"></toast-message>

Kullanım
# <script>
  const t = document.getElementById('toast');

  // Basit
  t.show('Saved', { type: 'success', extraHTML: 'Changes saved.' });

  // Hata
  t.show('Error', { type: 'error', extraHTML: 'Please try again.' });

  // Özel ikon (SVG)
  t.show('Heads up', {
    type: 'info',
    iconHTML: '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">...</svg>',
    extraHTML: 'New settings available.'
  });
# </script>

API
| Seçenek     | Tip                                           | Varsayılan | Açıklama                                    |
| ----------- | --------------------------------------------- | ---------- | ------------------------------------------- |
| `message`   | `string`                                      | –          | Başlık/ana metin.                           |
| `timeout`   | `number`                                      | `3000`     | Otomatik kapanma (ms). `0` = kapanmaz.      |
| `type`      | `"info" \| "success" \| "error" \| "warning"` | `"info"`   | Tema + ikon.                                |
| `extraHTML` | `string`                                      | –          | Alt açıklama alanına HTML.                  |
| `iconHTML`  | `string`                                      | –          | Varsayılan ikon yerine kendi SVG/IMG/emoji. |
| `glyph`     | `string`                                      | –          | Pseudo-ikon metni (örn. `"✓"`).             |
| `className` | `string \| string[]`                          | –          | Ek sınıf(lar).                              |
| `width`     | `string`                                      | `auto`     | Genişlik.                                   |
| `height`    | `string`                                      | `auto`     | Yükseklik.                                  |

t.hide()
Açık toast’ı kapatır.

## Notlar

Tema mantığı: info bazdır; success/error/warning sadece rengi/ikonu override eder.
Erişilebilirlik: role="status", aria-live="polite", kapatma butonu.
Konum: varsayılan sağ-üst. Farklı konum için .toast’ın top/right değerlerini override edebilirsin.

# Basit Demo
<button onclick="toast.show('Saved', { type:'success', extraHTML:'Done.' })">Success</button>
<button onclick="toast.show('Error', { type:'error', extraHTML:'Try again.' })">Error</button>
<button onclick="toast.hide()">Hide</button>

<toast-message id="toast"></toast-message>
<script src="toast.js"></script>
<script>const toast = document.getElementById('toast');</script>

Lisans
MIT © 2025 Kaan Okluçam