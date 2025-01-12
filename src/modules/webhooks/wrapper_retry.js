// wrapper.js
const import_wrapper_rety = async () => {
    const { default: pRetry } = await import('p-retry');
    return pRetry;
};

module.exports = import_wrapper_rety;