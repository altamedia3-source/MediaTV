const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// MediaManager
content = content.replace(/const deleteMedia = async \(id: number\) => {[\s\S]*?bc\.close\(\);\n  };/g, 
`const deleteMedia = async (id: number) => {
    const remaining = media.filter(m => m.id !== id);
    const reordered = remaining.map((m, i) => ({ ...m, order: i }));
    await updateScreenData({ media: reordered });
  };`);

content = content.replace(/const moveMedia = async \(index: number, direction: 'up' \| 'down'\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const moveMedia = async (index: number, direction: 'up' | 'down') => {
    if (!media || media.length < 2) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === media.length - 1) return;

    const newOrderList = [...media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newOrderList[index];
    newOrderList[index] = newOrderList[targetIndex];
    newOrderList[targetIndex] = temp;

    const reordered = newOrderList.map((m, i) => ({ ...m, order: i }));
    await updateScreenData({ media: reordered });
  };`);

content = content.replace(/const toggleActive = async \(id: number, active: boolean\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const toggleActive = async (id: number, active: boolean) => {
    const updated = media.map(m => m.id === id ? { ...m, active } : m);
    await updateScreenData({ media: updated });
  };`);

content = content.replace(/const updateDuration = async \(id: number, duration: number\) => {[\s\S]*?};/g,
`const updateDuration = async (id: number, duration: number) => {
    const updated = media.map(m => m.id === id ? { ...m, duration: Math.max(1, duration) } : m);
    await updateScreenData({ media: updated });
  };`);

// Remove processFiles local upload and disable the File input since it's cloud
content = content.replace(/const processFiles = async \(files: FileList \| null\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const processFiles = async (files: FileList | null) => {
    alert("Karena aplikasi sekarang berbasis Cloud, silakan gunakan 'Tambah via Link URL' untuk memasukkan video.");
  };`);

// TextManager
content = content.replace(/const texts = useLiveQuery\(\(\) => db\.texts\.orderBy\('order'\)\.toArray\(\)\);/g,
`const { data, updateScreenData } = useScreenContext();
  const texts = data?.texts || [];`);

content = content.replace(/const handleAddText = async \(e: React\.FormEvent\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTextContent.trim()) return;

    const currentCount = texts.length;
    const newItem = {
      id: Date.now(),
      type: newTextType,
      content: newTextContent.trim(),
      active: true,
      order: currentCount,
    };
    
    await updateScreenData({ texts: [...texts, newItem] });

    setNewTextContent('');
    setShowAddForm(false);
  };`);

content = content.replace(/const saveEdit = async \(id: number\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const saveEdit = async (id: number) => {
    if (!editingContent.trim()) return;
    const updated = texts.map(t => t.id === id ? { ...t, content: editingContent.trim() } : t);
    await updateScreenData({ texts: updated });
    setEditingId(null);
  };`);

content = content.replace(/const deleteText = async \(id: number\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const deleteText = async (id: number) => {
    const remaining = texts.filter(t => t.id !== id);
    const reordered = remaining.map((t, i) => ({ ...t, order: i }));
    await updateScreenData({ texts: reordered });
  };`);

content = content.replace(/const toggleActive = async \(id: number, active: boolean\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const toggleActiveText = async (id: number, active: boolean) => {
    const updated = texts.map(t => t.id === id ? { ...t, active } : t);
    await updateScreenData({ texts: updated });
  };`);
// Fix toggleActive references in TextManager
content = content.replace(/onChange={\(e\) => toggleActive\(item\.id!, e\.target\.checked\)}/g, 
`onChange={(e) => toggleActiveText(item.id!, e.target.checked)}`);

content = content.replace(/const moveText = async \(index: number, direction: 'up' \| 'down'\) => {[\s\S]*?bc\.close\(\);\n  };/g,
`const moveText = async (index: number, direction: 'up' | 'down') => {
    if (!texts || texts.length < 2) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === texts.length - 1) return;

    const newOrderList = [...texts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newOrderList[index];
    newOrderList[index] = newOrderList[targetIndex];
    newOrderList[targetIndex] = temp;

    const reordered = newOrderList.map((t, i) => ({ ...t, order: i }));
    await updateScreenData({ texts: reordered });
  };`);


// SettingsManager
content = content.replace(/const settings = useLiveQuery\(\(\) => db\.settings\.get\(1\)\);/g,
`const { data, updateScreenData } = useScreenContext();
  const settings = data?.settings;`);

content = content.replace(/const handleLogoFileUpload = \(file: File\) => {[\s\S]*?reader\.readAsDataURL\(file\);\n  };/g,
`const handleLogoFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxHeight = 300;
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/png', 0.8);
          updateMultipleSettings({ logoUrl: resizedDataUrl, showLogo: true });
        }
      };
      img.onerror = () => {
        updateMultipleSettings({ logoUrl: rawDataUrl, showLogo: true });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };`);


content = content.replace(/const updateSetting = <K extends keyof AppSettings>\(key: K, value: AppSettings\[K\]\) => {[\s\S]*?bc\.close\(\);\n    \}\);\n  };/g,
`const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    if (!settings) return;
    updateScreenData({ settings: { ...settings, [key]: value } });
  };`);

content = content.replace(/const updateMultipleSettings = \(newSettings: Partial<AppSettings>\) => {[\s\S]*?bc\.close\(\);\n    \}\);\n  };/g,
`const updateMultipleSettings = (newSettings: Partial<AppSettings>) => {
    if (!settings) return;
    updateScreenData({ settings: { ...settings, ...newSettings } });
  };`);

// Finally, we need to initialize settings if it doesn't exist, which useScreenData handles.
fs.writeFileSync('src/pages/Dashboard.tsx', content);
