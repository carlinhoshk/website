import type { BannerData } from '$lib/types/banner';

export const prerender = true;
export const trailingSlash = 'never';

const bannerStartDate = new Date('July 05 2023 06:00:00 EST');
const bannerEndDate = new Date('October 14 2023 06:00:00 EST');

export async function load() {
	const currentDate = new Date();

	return {
		bannerData: {
			display:
				bannerStartDate < currentDate && currentDate < bannerEndDate,
			startDate: bannerStartDate,
			endDate: bannerEndDate,
		} satisfies BannerData,
	};
}
