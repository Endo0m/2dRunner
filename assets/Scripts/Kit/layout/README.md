# kit/layout

Минимальный Layout-kit для Cocos Creator (playables friendly).

Идея:
- один LayoutController на Canvas
- компоненты-адаптеры реализуют метод:
  setLandscapeMode(isLandscape: boolean)

LayoutController сам определяет ориентацию и рассылает режим всем адаптерам.

---

## Установка

1) Добавь `LayoutController` на `Canvas` (или корневой UI-узел).
2) На нужные элементы добавляй адаптеры:
- FooterVariantSwitcher (меняет SpriteFrame)
- NodeActiveVariantSwitcher (включает/выключает ветки UI)
- TransformVariantSwitcher (position/scale/angle)

---

## Как работает

- LayoutController слушает `screen.on('window-resize')`
- Берет `view.getVisibleSize()`
- Определяет `isLandscape = width >= height`
- Если режим изменился — вызывает `setLandscapeMode(isLandscape)` у всех найденных компонентов.

---

## Когда что использовать

### FooterVariantSwitcher
Если нужно менять контент (например, другой спрайт футера) при смене ориентации.
Обычно в связке с Widget, который растягивает футер по ширине.

### NodeActiveVariantSwitcher
Если портретный и ландшафтный UI реально разные по структуре:
- разные контейнеры
- разные позиции CTA/score/tutorial
Самый быстрый и стабильный способ для playables.

### TransformVariantSwitcher
Если элемент один и тот же, но должен менять:
- позицию
- scale
- угол
между portrait и landscape.

---

## Рекомендованные правила

1) Не вешай `window-resize` в каждом компоненте — только через LayoutController.
2) Для fly-to-score FX считай координаты в пространстве общего UI-слоя (fxLayer).
3) Для сложных компоновок предпочитай NodeActiveVariantSwitcher вместо попыток “универсальных якорей”.

---

## Пример иерархии

Canvas
- LayoutController
- HUD
  - NodeActiveVariantSwitcher (portraitNode=HUD_P, landscapeNode=HUD_L)
- Footer
  - FooterVariantSwitcher
  - Widget (растянуть по ширине)
- ScoreIcon
  - TransformVariantSwitcher
