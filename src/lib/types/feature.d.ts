import type { Lottie } from './lottie';

interface moreButton {
	text: string;
	href: string;
	type?: 'secondary' | 'tertiary' | 'gray';
}

export type Feature = {
	title: string;
	paragraph: string;
	moreButton?: moreButton;
	secondaryButton?: { text: string; href: string };
	ctaButton?: { text: string; href: string };
	featureList?: string[];
	image?: {
		darkSrc?: string;
		src: string;
		alt: string;
		height?: number | string;
		width?: number | string;
		classNames?: string;
		styles?: string;
	};
	footnote?: string;
	terminal?: {
		source: string;
		skipToEnd?: boolean;
		shadow?: 'grey' | 'brand' | false;
		narrow?: boolean;
		dark?: boolean;
	};
	previewComponent?: any;
	lottie?: Lottie;
	showTheMediaFirstOnMobile?: boolean;
	headingLevel?: 'h2' | 'h3';
};

export type verticalFeature = {
	title: string;
	paragraph: string;
	moreButton?: moreButton;
	previewComponent?: any;
};
