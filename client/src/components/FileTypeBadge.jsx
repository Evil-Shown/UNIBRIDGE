const FileTypeBadge = ({ type }) => {
  const typeStyles = {
    PDF: 'bg-red-100 text-red-800',
    DOC: 'bg-blue-100 text-blue-800',
    DOCX: 'bg-blue-100 text-blue-800',
    XLS: 'bg-green-100 text-green-800',
    XLSX: 'bg-green-100 text-green-800',
    PPT: 'bg-orange-100 text-orange-800',
    PPTX: 'bg-orange-100 text-orange-800',
    VIDEO: 'bg-purple-100 text-purple-800',
    AUDIO: 'bg-pink-100 text-pink-800',
    ZIP: 'bg-gray-100 text-gray-800',
    FILE: 'bg-slate-100 text-slate-800',
  };

  const typeLabel = type?.toUpperCase() || 'FILE';
  const style = typeStyles[typeLabel] || typeStyles.FILE;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${style}`}>
      {typeLabel}
    </span>
  );
};

export default FileTypeBadge;
