import React from 'react'
import ReactDOM from 'react-dom'
import App, {
	TagSegment,
	addTagSeg,
	findFocusedSeg,
	changeFocusedSeg,
	deleteSeg,
} from './DatumBar'

//function getTagSegsFromDatum(datum: Datum): TagSegment[] {}

it('renders without crashing', () => {
	const div = document.createElement('div')
	ReactDOM.render(<App />, div)
	ReactDOM.unmountComponentAtNode(div)
})

//it('converts datums into tag segments', () => {})

it('adds tag segments', () => {
	let before: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: true },
	]
	let after: TagSegment[] = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false }, // change
		{ text: '', isFocused: true }, // change
	]
	expect(addTagSeg(before)).toEqual(after)

	before = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: true },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	after = [
		{ text: 'a', isFocused: false },
		{ text: 'b', isFocused: false }, // change
		{ text: '', isFocused: true }, // change
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(addTagSeg(before)).toEqual(after)

	before = [
		{ text: 'a', isFocused: false },
		{ text: '', isFocused: true },
		{ text: 'c', isFocused: false },
		{ text: 'd', isFocused: false },
	]
	expect(addTagSeg(before)).toEqual(before)

	before = []
	after = [{ text: '', isFocused: true }]
	expect(addTagSeg(before)).toEqual(after)
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