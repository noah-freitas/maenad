let templateStr = `
<template>
    <article>
        <h1>Import Files</h1>
        <input type="file" multiple>
    </article>
</template>
`;

export default new DOMParser().parseFromString(templateStr, 'text/html')
                              .querySelector('template');
