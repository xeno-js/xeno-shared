import { beforeEach, describe, expect, it } from 'vitest'

import type { IDomainEvent } from '../../events'
import { type IValueObject } from '../../value_objects/ivalue-object.contracts'
import { AggregateRoot } from '../aggregate-root'

// Mock ValueObject for testing
class MockId implements IValueObject<{ value: string }> {
  constructor(private readonly _value: { value: string }) {}
  getValue() {
    return this._value
  }
  equals(other: IValueObject<{ value: string }>) {
    return this.getValue().value === other.getValue().value
  }
  toString() {
    return this._value.value
  }
}

// Concrete implementation of AggregateRoot for testing
interface TestEventPayload {
  foo: string
}

class TestAggregate extends AggregateRoot<TestEventPayload, { value: string }> {
  public lastAppliedEvent: IDomainEvent<TestEventPayload> | null = null
  public state = ''

  protected apply(event: IDomainEvent<TestEventPayload>, _isNew: boolean): void {
    this.lastAppliedEvent = event
    if (event.eventType === 'TestEvent') {
      this.state = event.payload.foo
    }
  }

  public triggerTestEvent(foo: string) {
    this.raise({ eventType: 'TestEvent', payload: { foo } })
  }
}

describe('AggregateRoot', () => {
  let id: MockId
  let aggregate: TestAggregate

  beforeEach(() => {
    id = new MockId({ value: 'test-id' })
    aggregate = new TestAggregate(id)
  })

  it('should initialize with the correct ID and version 0', () => {
    expect(aggregate.id.getValue()).toEqual({ value: 'test-id' })
    expect(aggregate.version).toBe(0)
  })

  it('should add events to uncommitted events when raised', () => {
    aggregate.triggerTestEvent('bar')

    const uncommitted = aggregate.getUncommittedEvents()
    expect(uncommitted).toHaveLength(1)
    expect(uncommitted[0].eventType).toBe('TestEvent')
    expect(uncommitted[0].payload.foo).toBe('bar')
    expect(uncommitted[0].aggregateId.getValue()).toEqual({ value: 'test-id' })
    expect(uncommitted[0].version).toBe(1)
    expect(aggregate.version).toBe(1)
  })

  it('should clear uncommitted events', () => {
    aggregate.triggerTestEvent('bar')
    expect(aggregate.getUncommittedEvents()).toHaveLength(1)

    aggregate.clearUncommittedEvents()
    expect(aggregate.getUncommittedEvents()).toHaveLength(0)
  })

  it('should load from history and update version', () => {
    const history: IDomainEvent<TestEventPayload, MockId>[] = [
      {
        eventType: 'TestEvent',
        payload: { foo: 'event1' },
        aggregateId: id,
        version: 1,
        occurredAt: new Date(),
      },
      {
        eventType: 'TestEvent',
        payload: { foo: 'event2' },
        aggregateId: id,
        version: 2,
        occurredAt: new Date(),
      },
    ]

    aggregate.loadFromHistory(history)

    expect(aggregate.version).toBe(2)
    expect(aggregate.state).toBe('event2')
    expect(aggregate.getUncommittedEvents()).toHaveLength(0)
  })

  it('should not add events to uncommitted list when loading from history', () => {
    const history: IDomainEvent<TestEventPayload, MockId>[] = [
      {
        eventType: 'TestEvent',
        payload: { foo: 'event1' },
        aggregateId: id,
        version: 1,
        occurredAt: new Date(),
      },
    ]

    aggregate.loadFromHistory(history)

    expect(aggregate.getUncommittedEvents()).toHaveLength(0)
    expect(aggregate.version).toBe(1)
  })
})
