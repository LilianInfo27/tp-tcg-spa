<template>
  <article
    class="card"
    :class="[
      `card--${size}`,
      {
        'card--selected': selected,
        'card--disabled': disabled,
        'card--selectable': selectable,
      },
    ]"
    :role="selectable ? 'button' : undefined"
    :tabindex="selectable && !disabled ? 0 : undefined"
    @click="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <div class="card__media">
      <img :src="imageUrl" :alt="card.name" class="card__image" />
      <span class="card__dex">#{{ formattedPokedexNumber }}</span>
    </div>

    <div class="card__content">
      <div class="card__header">
        <h3 class="card__name">{{ card.name }}</h3>
        <span class="card__type" :style="typeStyle">{{ card.type }}</span>
      </div>

      <dl class="card__stats">
        <div>
          <dt>HP</dt>
          <dd>{{ card.hp }}</dd>
        </div>
        <div>
          <dt>Attaque</dt>
          <dd>{{ card.attack }}</dd>
        </div>
      </dl>

      <div v-if="currentHp !== undefined" class="card__hp">
        <div class="card__hp-meta">
          <span>HP courants</span>
          <strong>{{ clampedCurrentHp }} / {{ card.hp }}</strong>
        </div>
        <div class="card__hp-track">
          <span class="card__hp-bar" :style="hpBarStyle" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
    currentHp?: number
  }>(),
  {
    size: 'md',
    selectable: false,
    selected: false,
    disabled: false,
    currentHp: undefined,
  },
)

const emit = defineEmits<{
  select: [cardId: number]
}>()

const { getTypeColor, hpColor } = useColors()

const formattedPokedexNumber = computed(() =>
  String(props.card.pokedexNumber).padStart(3, '0'),
)

const typeStyle = computed(() => ({
  backgroundColor: getTypeColor(props.card.type),
}))

const clampedCurrentHp = computed(() => {
  if (props.currentHp === undefined) {
    return undefined
  }

  return Math.max(0, Math.min(props.card.hp, props.currentHp))
})

const hpPercent = computed(() => {
  if (clampedCurrentHp.value === undefined || props.card.hp <= 0) {
    return 0
  }

  return Math.round((clampedCurrentHp.value / props.card.hp) * 100)
})

const hpBarStyle = computed(() => ({
  width: `${hpPercent.value}%`,
  backgroundColor: hpColor(hpPercent.value),
}))

const imageUrl = computed(() => {
  if (props.card.imgUrl && props.card.imgUrl.trim().length > 0) {
    return props.card.imgUrl
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${props.card.pokedexNumber}.png`
})

const handleSelect = () => {
  if (!props.selectable || props.disabled) {
    return
  }

  emit('select', props.card.id)
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
  min-width: 0;
  padding: 0.95rem;
  border: 1px solid #d8dee9;
  border-radius: 20px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98),
      rgba(243, 246, 251, 0.94)
    ),
    linear-gradient(135deg, rgba(14, 116, 144, 0.06), rgba(251, 191, 36, 0.08));
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    opacity 0.18s ease;
}

.card--sm {
  min-height: 280px;
}

.card--md {
  min-height: 340px;
}

.card--selectable {
  cursor: pointer;
}

.card--selectable:hover,
.card--selectable:focus-visible {
  transform: translateY(-3px);
  border-color: #0f766e;
  box-shadow: 0 20px 42px rgba(15, 118, 110, 0.18);
  outline: none;
}

.card--selected {
  border-color: #0f766e;
  box-shadow:
    0 0 0 3px rgba(15, 118, 110, 0.14),
    0 22px 42px rgba(15, 118, 110, 0.18);
}

.card--disabled {
  opacity: 0.45;
  filter: grayscale(0.18);
  cursor: not-allowed;
}

.card__media {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at top,
      rgba(255, 255, 255, 0.8),
      rgba(203, 213, 225, 0.35)
    ),
    #e2e8f0;
}

.card__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.card__dex {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.82);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 700;
}

.card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.card__header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  justify-content: space-between;
}

.card__name {
  margin: 0;
  color: #172033;
  font-size: 1.05rem;
  line-height: 1.2;
  min-width: 0;
  overflow-wrap: anywhere;
}

.card__type {
  flex-shrink: 0;
  max-width: 45%;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  color: #172033;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  margin: 0;
}

.card__stats div {
  padding: 0.8rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
}

.card__stats dt {
  margin-bottom: 0.25rem;
  color: #52607a;
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card__stats dd {
  margin: 0;
  color: #172033;
  font-size: 1rem;
  font-weight: 800;
}

.card__hp {
  margin-top: auto;
}

.card__hp-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.45rem;
  color: #52607a;
  font-size: 0.78rem;
}

.card__hp-track {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.28);
}

.card__hp-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.2s ease;
}

@media (max-width: 640px) {
  .card {
    padding: 0.85rem;
  }

  .card__header {
    flex-direction: column;
  }

  .card__type {
    max-width: 100%;
  }
}
</style>
