## Быстрый старт

```ts
import { TweenAnimations } from '../kit/tween/TweenAnimations';

TweenAnimations.popScale(buttonNode, { durationSeconds: 0.12 }).start();

Все методы возвращают Tween.
Для запуска анимации обязательно вызвать .start().

Общие правила

Один Node — одна активная анимация

По умолчанию stopPrevious = true.
Это предотвращает наложение tweens и визуальные баги.

fade() требует UIOpacity

Если компонента нет — метод вернёт null.

flyArcLocal() работает в локальных координатах

Для UI используй:

uiTransform.convertToNodeSpaceAR(worldPosition)


Библиотека не управляет состояниями и событиями
Она только анимирует.

API
stopAll(target: Node): void

Останавливает все tween-анимации, привязанные к target.

Когда использовать

перед запуском сложного sequence / parallel

при сбросе состояния или рестарте

TweenAnimations.stopAll(node);

popScale(target: Node, options): Tween<Node>

Короткая scale-анимация (“pop”).

Типичные кейсы

кнопки

иконки

подтверждение действия

акцент CTA

TweenAnimations.popScale(node, {
  durationSeconds: 0.14,
  fromScale: 0.9,
  toScale: 1.0,
  easing: 'backOut'
}).start();


Опции

durationSeconds — обязательно

fromScale — default 0.9

toScale — default 1.0

easing — default 'backOut'

stopPrevious — default true

fade(target: Node, options): Tween<UIOpacity> | null

Плавное изменение прозрачности через UIOpacity.

Типичные кейсы

туториалы

подсказки

fade-in / fade-out UI

TweenAnimations.fade(node, {
  durationSeconds: 0.2,
  from: 0,
  to: 255,
  easing: 'quadOut'
})?.start();


Опции

durationSeconds — обязательно

from — default = текущая opacity

to — обязательно (0..255)

easing — default 'quadOut'

stopPrevious — default true

shakePosition(target: Node, options): Tween<Node>

Короткая тряска позиции (fail feedback / “удар”).

Типичные кейсы

неправильный тап

недостаточно ресурса

ошибка действия

TweenAnimations.shakePosition(node, {
  durationSeconds: 0.18,
  strengthX: 14,
  strengthY: 10,
  vibrato: 10,
  damping: 0.7
}).start();


Опции

durationSeconds — обязательно

strengthX, strengthY — амплитуда (default 12)

vibrato — количество рывков (default 10)

damping — затухание 0..1 (default 0.65)

restoreOriginal — вернуть исходную позицию (default true)

stopPrevious — default true

punchRotation(target: Node, options): Tween<Node>

Короткий “пинок” вращения туда-сюда.

Типичные кейсы

оживление UI

реакция на изменение значения

акцент события

TweenAnimations.punchRotation(node, {
  durationSeconds: 0.14,
  degrees: 10,
  vibrato: 8,
  damping: 0.6
}).start();


Опции

durationSeconds — обязательно

degrees — максимальный угол

vibrato — количество рывков (default 8)

damping — затухание 0..1 (default 0.55)

restoreOriginal — вернуть исходный угол (default true)

stopPrevious — default true

flyArcLocal(target, fromLocal, toLocal, options): Tween<Node>

Полет из точки A в B по дуге (Bezier) в локальных координатах.

Это универсальная версия паттерна “pickup → score”.

Типичные кейсы

валюта → счетчик

предмет → слот

награда → иконка

любой FX “fly-to-target”

TweenAnimations.flyArcLocal(fxNode, fromLocal, toLocal, {
  durationSeconds: 0.75,
  arcHeight: 180,
  rotateDegrees: 720,
  startScale: 0.15,
  endScale: 0.0,
  destroyOnComplete: true
}).start();


Опции

durationSeconds — обязательно

arcHeight — высота дуги

rotateDegrees — поворот за полёт (default 0)

startScale — стартовый scale (default 1)

endScale — конечный scale (default 0)

moveEasing — default 'quadInOut'

scaleEasing — default 'quadIn'

destroyOnComplete — default false

stopPrevious — default true

Рекомендуемый паттерн использования (pickup → score)

Спавни FX prefab в общем fxLayer

Конвертируй координаты в локальное пространство fxLayer

Запускай flyArcLocal

Оригинальный pickup можно сразу скрыть

const fromLocal = fxLayerUI.convertToNodeSpaceAR(pickup.worldPosition);
const toLocal = fxLayerUI.convertToNodeSpaceAR(scoreIcon.worldPosition);

TweenAnimations.flyArcLocal(fxNode, fromLocal, toLocal, {
  durationSeconds: 0.7,
  arcHeight: 160,
  rotateDegrees: 720,
  startScale: 0.2,
  endScale: 0,
  destroyOnComplete: true
}).start();