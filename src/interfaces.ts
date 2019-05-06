export interface Tag {
	name: string
	value?: string
}

export interface TagSegment {
	text: string
	isFocused: boolean
	placeholder?: string
	hasValue?: boolean
}

export interface Datum {
	id: string
	time: number
	tags: Tag[]
}

export interface Props {
	activeDatum?: Datum
}

export interface State {
	segments: TagSegment[]
}
