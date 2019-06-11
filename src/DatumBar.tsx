import React, {
	//FunctionComponent,
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	KeyboardEvent,
} from 'react'
import { TagSegment } from './interfaces'
import './DatumBar.css'

export function findFocusedSeg(segs: TagSegment[]): number {
	let focused = segs.filter(s => s.isFocused)
	if (!focused.length) return -1
	if (focused.length > 1)
		throw new Error('more than one input is "focused"')
	return segs
		.map((s, i) => (s.isFocused ? i : 0))
		.reduce((sum, i) => (sum += i))
}

// prettier-ignore
export function addSeg(segs: TagSegment[]): TagSegment[] {
	// prettier-ignore
	let i: number = findFocusedSeg(segs)
	if (segs.length && !segs[i].text) return segs
	let newSeg: TagSegment = { text: '', isFocused: true, isValue: false }
	if (segs.length && !segs[i].isValue) newSeg.isValue = true
	segs = segs.map(s => ({ ...s, isFocused: false }))
	segs.splice(i + 1, 0, newSeg)
	return segs
}

export function deleteSeg(
	segs: TagSegment[]
): TagSegment[] {
	// prettier-ignore
	if (!segs.length) throw new Error(
		'cannot remove segments from an empty bar'
	)
	const i: number = findFocusedSeg(segs)
	let focusedSeg: TagSegment = segs[i]
	let otherSegs: TagSegment[] = segs.filter(
		s => s.isFocused === false
	)

	if (focusedSeg.text) return segs
	if (!otherSegs.length) return [focusedSeg]
	if (i === 0) {
		otherSegs[0].isFocused = true
	} else {
		otherSegs[i - 1].isFocused = true
	}
	return otherSegs
}

export function changeFocusedSeg(
	segs: TagSegment[],
	i: number
) {
	if (!segs.length)
		throw new Error('cannot change focus of an empty bar')
	if (i >= segs.length)
		throw new Error('index out of range')
	segs = segs.map(s => ({ ...s, isFocused: false }))
	if (i < 0) return segs
	segs[i].isFocused = true
	if (segs[i].text === '+') segs[i].text = ''
	return segs
}

export function placeAddValueButtons(
	segs: TagSegment[]
): TagSegment[] {
	const button: TagSegment = {
		text: '+',
		isFocused: false,
		isValue: true,
	}
	let newSegs = [...segs]
	let indexAdj = 0
	segs.forEach((s, i) => {
		if (!s.text) return
		if (s.text === '+') return
		if (hasPair(segs, i)) return
		if (s.isValue) return
		newSegs.splice(i + indexAdj + 1, 0, button)
		indexAdj++
	})
	return newSegs
}

export function hasPair(
	segs: TagSegment[],
	i: number
): boolean {
	if (i < 0 || i >= segs.length)
		throw new Error('index out of range')
	if (segs[i].isValue) return true
	if (!segs[i + 1]) return false
	if (segs[i + 1].text === '+') return true
	if (segs[i + 1].isFocused) return true
	return false
}

export function makeEmptySegsButtons(
	segs: TagSegment[]
): TagSegment[] {
	return segs.map(s => {
		if (!s.text && !s.isFocused) {
			return { ...s, text: '+' }
		} else {
			return s
		}
	})
}

export function removeValueFromEmptyTag(
	segs: TagSegment[]
): TagSegment[] {
	let to_remove: number[] = []
	let index_adj = 0
	segs.map((s, i) => {
		if (!s.text && hasPair(segs, i)) to_remove.push(i + 1)
		return null
	})
	let newSegs = [...segs]
	for (let i of to_remove) {
		newSegs.splice(i - index_adj, 1)
		index_adj++
	}
	return newSegs
}

export default function DatumBar() {
	const newSeg = [{ text: '', isFocused: true }]
	const [segments, setSegments] = useState(newSeg)
	let refs: any[] = []

	useEffect(() => {
		refs[findFocusedSeg(segments)].focus()
	})

	function checkForBackspace(
		e: KeyboardEvent<HTMLInputElement>
	) {
		// prettier-ignore
		if (e.keyCode === 8) { // backspace
			setSegments(deleteSeg(segments))
		}
	}

	function handleChange(
		e: ChangeEvent<HTMLInputElement>,
		i: number
	) {
		e.preventDefault()
		let newSegs: TagSegment[] = [...segments]
		newSegs[i].text = e.currentTarget.value
		console.log(newSegs[i].isValue)
		if (!newSegs[i].isValue)
			newSegs = placeAddValueButtons(newSegs)
		newSegs = removeValueFromEmptyTag(newSegs)
		setSegments(newSegs)
	}

	function handleFocus(i: number) {
		let newSegs: TagSegment[] = [...segments]
		newSegs = changeFocusedSeg(newSegs, i)
		newSegs = makeEmptySegsButtons(newSegs)
		setSegments(newSegs)
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		let newSegs: TagSegment[] = [...segments]
		newSegs = addSeg(newSegs)
		let i: number = findFocusedSeg(newSegs)
		newSegs = changeFocusedSeg(newSegs, i)
		setSegments(newSegs)
	}

	function renderSegments(segments: TagSegment[]) {
		return segments.map((s, i) => {
			const classes: string = `
				${s.isValue ? 'tag-value' : 'tag-name'} 
				${hasPair(segments, i) ? '' : 'solo'}
			`
			if (s.isFocused) {
				return (
					<input
						key={i}
						ref={input => (refs[i] = input)}
						type='text'
						value={s.text}
						onFocus={e => handleFocus(i)}
						onChange={e => handleChange(e, i)}
						onKeyDown={checkForBackspace}
						className={classes}
					/>
				)
			} else {
				return (
					<button
						onFocus={e => handleFocus(i)}
						key={i}
						className={classes}
					>
						{s.text}
					</button>
				)
			}
		})
	}

	function renderButton(): any {
		if (segments.length > 1)
			return <button type='submit'>add datum</button>
	}
	return (
		<form onSubmit={handleSubmit}>
			{renderSegments(segments)}
			{renderButton()}
		</form>
	)
}

/*
['']
> a
['a', +t, +d, 'add']
> TAB
['a', '', +d, 'add']
> TAB
['a', '+t', '', 'add']
*/
