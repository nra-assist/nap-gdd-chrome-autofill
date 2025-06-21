console.error("Dialog overrides injected at document_start in frame", window.location.href);

window.alert = () => {};
window.confirm = () => true;
window.prompt = () => '';
