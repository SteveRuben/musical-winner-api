// wrapper.js
const import_wrapper = async () => {
    const { default: PQueue } = await import('p-queue');
    return PQueue;
};

module.exports = import_wrapper;