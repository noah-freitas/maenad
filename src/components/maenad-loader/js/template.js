let templateStr =
`<template>
    <article>
        <h1>Import Files</h1>
        <input type="file" multiple>
    </article>
</template>`;

let templateEl = new DOMParser().parseFromString(templateStr, 'text/html')
                                .querySelector('template');

export default createEl;

// createEl :: undefined -> Element
function createEl() {
    return document.importNode(templateEl.content, true);
}