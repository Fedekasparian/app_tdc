import { describe, it, expect, beforeEach } from 'vitest'
import { createCart } from './cartStore'

const exercise1 = { id: '1', name: 'Sentadilla', estimated_duration: 10 }
const exercise2 = { id: '2', name: 'Plancha', estimated_duration: 5 }
const exercise3 = { id: '3', name: 'Press hombro', estimated_duration: null }

describe('cartStore', () => {
  let cart: ReturnType<typeof createCart>

  beforeEach(() => {
    cart = createCart()
  })

  it('starts empty', () => {
    expect(cart.getItems()).toHaveLength(0)
  })

  it('adds an exercise', () => {
    cart.addExercise(exercise1)
    expect(cart.getItems()).toHaveLength(1)
    expect(cart.getItems()[0].id).toBe('1')
  })

  it('addExercise is idempotent — does not duplicate', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise1)
    expect(cart.getItems()).toHaveLength(1)
  })

  it('removeExercise removes by id', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise2)
    cart.removeExercise('1')
    expect(cart.getItems()).toHaveLength(1)
    expect(cart.getItems()[0].id).toBe('2')
  })

  it('reorder moves exercise to new position', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise2)
    cart.addExercise(exercise3)
    cart.reorder(0, 2)
    expect(cart.getItems().map(i => i.id)).toEqual(['2', '3', '1'])
  })

  it('reorder ignores invalid indices', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise2)
    cart.reorder(-1, 5)
    expect(cart.getItems().map(i => i.id)).toEqual(['1', '2'])
  })

  it('clear empties the cart', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise2)
    cart.clear()
    expect(cart.getItems()).toHaveLength(0)
  })

  it('getTotalDuration sums durations ignoring nulls', () => {
    cart.addExercise(exercise1)  // 10
    cart.addExercise(exercise2)  // 5
    cart.addExercise(exercise3)  // null
    expect(cart.getTotalDuration()).toBe(15)
  })

  it('getCount returns number of items', () => {
    cart.addExercise(exercise1)
    cart.addExercise(exercise2)
    expect(cart.getCount()).toBe(2)
  })
})
