# kit/aabb_collision

AABB (Rect) коллизии для UI/Canvas без физики.
Предназначено для playables: быстро, переносимо, контролируемо.

## Компоненты

- AabbHitbox2D — хитбокс на ноде (width/height/offset + kind + layer/mask)
- AabbCollisionWorld2D — мир коллизий
- IAabbCollisionListener — обработчик событий

## Базовый сценарий (player vs targets)

1) На Canvas добавь AabbCollisionWorld2D.
2) Укажи sensor = player hitbox (AabbHitbox2D на player).
3) На каждый pickup/damage/trigger повесь AabbHitbox2D и зарегистрируй его в world (обычно из onEnable).
4) Назначь listener (обычно player/controller), чтобы получать onAabbEnter(self, other).

## Kind vs Layer/Mask

- kind: "что это" (Pickup, Damage, Trigger)
- layer/mask: "кто с кем может сталкиваться"

Рекомендуется:
- player.layer = 0
- pickups.layer = 1
- damage.layer = 2
- trigger.layer = 3

И маски:
- player.mask = (1<<1) | (1<<2) | (1<<3)
- pickups.mask = (1<<0)
- damage.mask = (1<<0)

## Почему не string tags
Enum/числа безопаснее: нет опечаток и проще поддерживать.
