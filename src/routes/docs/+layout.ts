import { getDocsBySlug } from '$content/docs.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ url, params }) => {
	if (url.pathname == '/docs') {
		throw redirect(301, '/docs/introduction');
	}

	const doc = await getDocsBySlug(params.slug);

	if (!doc) {
		throw error(404, `Unable to find "${params.slug}" in the docs`);
	}

	return doc;
};
