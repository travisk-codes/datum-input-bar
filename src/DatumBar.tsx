import React, {
	//FunctionComponent,
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	KeyboardEvent,
} from 'react'
import { TagSegment } from './interfaces'

// prettier-ignore
export function addTagSeg(segs: TagSegment[]): TagSegment[] {
	// prettier-ignore
	let i: number = findFocusedSeg(segs)
	if (segs.length && !segs[i].text) return segs
	const newSeg: TagSegment = { text: '', isFocused: true }
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

export function findFocusedSeg(segs: TagSegment[]): number {
	let focused = segs.filter(s => s.isFocused)
	if (!focused.length) return -1
	if (focused.length > 1)
		throw new Error('more than one input is "focused"')
	return segs
		.map((s, i) => (s.isFocused ? i : 0))
		.reduce((sum, i) => (sum += i))
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
	return segs
}

export function placeAddValueButtons(
	segs: TagSegment[]
): TagSegment[] {
	let newSegs: TagSegment[] = [...segs].map((s, i) => {
		if (i > 0 && segs[i - 1].hasValue && s.hasValue)
			throw new Error('a value cannot have a value')
		if (!s.text.length && s.hasValue === false)
			return { ...s, hasValue: undefined }
		if (!s.text.length) return s
		if (i > 0 && segs[i - 1].hasValue) return s
		if (!s.hasValue) return { ...s, hasValue: false }
		return s
	})

	return newSegs
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

export default function DatumBar() {
	const newSeg = [{ text: '', isFocused: true }]
	const [segments, setSegments] = useState(newSeg)
	let refs: any[] = []
	useEffect(() => {
		refs[findFocusedSeg(segments)].focus()
	})

	function handleKeyDown(
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
		setSegments(placeAddValueButtons(newSegs))
	}

	function handleFocus(i: number) {
		let newSegs: TagSegment[] = [...segments]
		setSegments(changeFocusedSeg(newSegs, i))
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		let newSegs: TagSegment[] = addTagSeg([...segments])
		let i: number = findFocusedSeg(newSegs)
		newSegs = changeFocusedSeg(newSegs, i)
		setSegments(newSegs)
	}

	function renderSegments(segments: TagSegment[]) {
		const addValueButton = <button>+</button>
		return segments.map((s, i) => {
			let input = (
				<input
					key={i}
					ref={input => (refs[i] = input)}
					type='text'
					value={s.text}
					onFocus={e => handleFocus(i)}
					onChange={e => handleChange(e, i)}
					onKeyDown={handleKeyDown}
				/>
			)
			let button = (
				<button onFocus={e => handleFocus(i)} key={i}>
					{s.text}
				</button>
			)
			let seg = s.isFocused ? input : button
			if (s.hasValue === false) {
				return (
					<div key={i}>
						{seg}
						{addValueButton}
					</div>
				)
			} else return seg
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			{renderSegments(segments)}
			<button type='submit'>add datum</button>
		</form>
	)
}
