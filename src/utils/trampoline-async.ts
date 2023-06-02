export const trampolineAsync = async <T extends () => Promise<any>>(
	lazyPromise: () => Promise<T>
) => {
	const isFn = lazyPromise && typeof lazyPromise === 'function';
	while (isFn) lazyPromise = await lazyPromise();
};
