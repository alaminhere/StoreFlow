const formatDate = (date: string | Date | undefined) => {
  return new Date(date || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
export default formatDate;
