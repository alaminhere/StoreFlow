const getInitials = (name: string) => {
  const colors = [
    'bg-[#3DD598]',
    'bg-[#F5C451]',
    'bg-[#FF7185]',
    'bg-[#8795E5]',
    'bg-[#62C3DF]',
    'bg-[#12A474]',
    'bg-[#5969B8]',
    'bg-[#3186A8]',
  ];

  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];
  return {
    color,
    initials: name.slice(0, 2).toUpperCase(),
  };
};

export default getInitials;
