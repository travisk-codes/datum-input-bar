import React from 'react'
import ReactDOM from 'react-dom'
import DatumBar, {
	addSeg,
	findFocusedSeg,
	changeFocusedSeg,
	deleteSeg,
	placeAddValueButtons,
	makeEmptySegsButtons,
	hasPair,
	removeValueFromEmptyTag,
} from './DatumBar'
import { TagSegment } from './interfaces'

function newSeg(
	text: string = '',
	isFocused: boolean = false,
	isValue: boolean = false
): TagSegment {
	return { text, isFocused, isValue }
}

const invalidStates: TagSegment[][] = [
	[newSeg('', false, false)],
	[newSeg('', false, true)],
	[newSeg('', true, true)],
	[newSeg('a', true, true)],
	[newSeg('a', true, false), newSeg('', false, true)],
]

const states: TagSegment[][] = [
	[newSeg('', true, false)],
	[newSeg('a', true, false)],
	[newSeg('a', true, false), newSeg('+', false, true)],
	[newSeg('a', false, false), newSeg('+', true, true)],
	[newSeg('a', false, false), newSeg('', true, true)],
	[
		newSeg('a', false, false),
		newSeg('', true, true),
		newSeg('c', false, false),
	],
	[
		newSeg('a', false, false),
		newSeg('b', false, true),
		newSeg('c', true, false),
	],
	[
		newSeg('a', false, false),
		newSeg('b', false, true),
		newSeg('', true, false),
	],
	[
		newSeg('a', false, false),
		newSeg('b', true, true),
		newSeg('c', false, false),
		newSeg('d', false, true),
	],
]

it('renders without crashing', () => {
	const div = document.createElement('div')
	ReactDOM.render(<DatumBar />, div)
	ReactDOM.unmountComponentAtNode(div)
})

//it('converts datums into tag segments', () => {})

it('adds tag segments', () => {
	let before: TagSegment[] = [
		newSeg('a', false, false),
		newSeg('b', false, true),
		newSeg('c', false, false),
		newSeg('d', true, true),
	]
	let after: TagSegment[] = [
		newSeg('a', false, false),
		newSeg('b', false, true),
		newSeg('c', false, false),
		newSeg('d', false, true), // change
		newSeg('', true, false), // change
	]
	expect(addSeg(before)).toEqual(after)

	before = [
		newSeg('a', false, false),
		newSeg('b', true, true),
		newSeg('c', false, false),
		newSeg('d', false, true),
	]
	after = [
		newSeg('a', false, false),
		newSeg('b', false, true), // change
		newSeg('', true, false), // change
		newSeg('c', false, false),
		newSeg('d', false, true),
	]
	expect(addSeg(before)).toEqual(after)

	before = [
		newSeg('a', false, false),
		newSeg('', true, true),
		newSeg('c', false, false),
		newSeg('d', false, true),
	]
	expect(addSeg(before)).toEqual(before)

	before = []
	after = [newSeg('', true, false)]
	expect(addSeg(before)).toEqual(after)
})

it('finds the focused input', () => {
	let segs: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: true },
		{ text: 'd', isFocused: false },
	]
	expect(findFocusedSeg(segs)).toEqual(2)

	segs = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(findFocusedSeg(segs)).toEqual(-1)

	segs = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: true },
		{ text: 'd', isFocused: true },
	]
	expect(() => findFocusedSeg(segs)).toThrow()
})

it('changes the focused input', () => {
	let before: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: true },
		{ text: 'd', isFocused: false },
	]
	let after: TagSegment[] = [
		{ text: 'a', isFocused: true }, // change
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false }, // change
		{ text: 'd', isFocused: false },
	]
	expect(changeFocusedSeg(before, 0)).toEqual(after)

	before = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	after = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: true }, // change
	]
	expect(changeFocusedSeg(before, 3)).toEqual(after)

	before = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: true },
		{ text: 'd', isFocused: false },
	]
	after = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(changeFocusedSeg(before, -1)).toEqual(after)
	expect(() => changeFocusedSeg(before, 5)).toThrow()

	const emptyBar: TagSegment[] = []
	expect(() => changeFocusedSeg(emptyBar, 0)).toThrow()

	before = [
		{ text: 'a', isFocused: false },
		{ text: '+', isFocused: false },
		{ text: 'c', isFocused: true },
		{ text: 'd', isFocused: false },
	]
	after = [
		{ text: 'a', isFocused: false },
		{ text: '', isFocused: true },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(changeFocusedSeg(before, 1)).toEqual(after)
})

it('deletes segments', () => {
	let before: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: '', isFocused: true }, // to change
		{ text: 'd', isFocused: false },
	]
	let after: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: true },
		{ text: 'd', isFocused: false },
	]
	expect(deleteSeg(before)).toEqual(after)

	before = [
		{ text: '', isFocused: true }, // to change
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	after = [
		{ text: 'b', isFocused: true },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(deleteSeg(before)).toEqual(after)

	before = [{ text: '', isFocused: true }]
	expect(deleteSeg(before)).toEqual(before)

	const emptyBar: TagSegment[] = []
	expect(() => deleteSeg(emptyBar)).toThrow()
})

it('places add-value buttons after non-empty tagnames', () => {
	/*let before = [newSeg('a', true, false)]
	let after = [...before, newSeg('', false, true)]
	expect(placeAddValueButtons(before)).toEqual(after)
*/
	let before = [
		newSeg('a', true, false),
		newSeg('+', false, false),
	]
	let after = [
		before[0],
		newSeg('+', false, true),
		before[1],
	]
	expect(placeAddValueButtons(before)).toEqual(after)
	/*
	before = [newSeg('a', false, false)]
	after = [...before, newSeg()]
	expect(placeAddValueButtons(before)).toEqual(after)
*/
	before = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: '', isFocused: true },
	]
	after = [
		{ text: 'a', isFocused: false },
		newSeg('+'),
		{ text: 'b', isFocused: false },
		newSeg('+'),
		{ text: '', isFocused: true },
	]
	expect(placeAddValueButtons(before)).toEqual(after)

	before = [
		{ text: '', isFocused: true },
		{ text: 'b', isFocused: false },
		newSeg('+'),
		{ text: 'c', isFocused: false },
		newSeg('+'),
	]

	expect(placeAddValueButtons(before)).toEqual(before)

	before = [
		{ text: '', isFocused: true },
		{ text: 'b', isFocused: false },
	]
	after = [
		{ text: '', isFocused: true },
		{ text: 'b', isFocused: false },
		newSeg('+'),
	]
	expect(placeAddValueButtons(before)).toEqual(after)
})

it('replaces blurred empty segments with "+"', () => {
	let before = [newSeg()]
	let after = [newSeg('+')]
	expect(makeEmptySegsButtons(before)).toEqual(after)

	before = [newSeg('a')]
	expect(makeEmptySegsButtons(before)).toEqual(before)

	before = [{ ...newSeg(), isFocused: true }]
	expect(makeEmptySegsButtons(before)).toEqual(before)
})

it('checks if a segment has a value/button', () => {
	let segs = [newSeg()]
	expect(hasPair(segs, 0)).toEqual(false)
	expect(() => hasPair(segs, 1)).toThrow()

	segs = [newSeg('a', false, false), newSeg('', true, true)]
	expect(hasPair(segs, 0)).toEqual(true)
	expect(hasPair(segs, 1)).toEqual(true)

	segs = [
		newSeg('a', false, false),
		newSeg('b', false, true),
	]
	expect(hasPair(segs, 0)).toEqual(false)

	segs = [newSeg('a'), newSeg('b'), newSeg('+')]
	expect(hasPair(segs, 0)).toEqual(false)
	expect(hasPair(segs, 1)).toEqual(true)
})

it('removes add-value buttons from empty tags', () => {
	let before = [
		{ ...newSeg(), isFocused: true },
		newSeg('+'),
	]
	let after = [{ ...newSeg(), isFocused: true }]
	expect(removeValueFromEmptyTag(before)).toEqual(after)

	before = [{ ...newSeg(), isFocused: true }]
	expect(removeValueFromEmptyTag(before)).toEqual(before)
})
