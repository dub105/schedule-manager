import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useStore } from '../store';
import type { BelongingTemplate } from '../types';
import { generateId } from '../utils';

const EMOJI_OPTIONS = ['💼', '🏋️', '✈️', '🏥', '📚', '🎮', '🏃', '🍽️', '🎵', '🏖️', '🏔️', '🎪'];

export default function TemplateManager() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">持ち物テンプレート</h2>
          <p className="text-xs text-slate-500 mt-0.5">よく使う持ち物セットを登録して再利用できます</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            新規
          </button>
        )}
      </div>

      {isCreating && (
        <TemplateEditor
          onSave={(tpl) => { addTemplate(tpl); setIsCreating(false); }}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="space-y-3">
        {templates.map((tpl) =>
          editingId === tpl.id ? (
            <TemplateEditor
              key={tpl.id}
              initial={tpl}
              onSave={(updated) => { updateTemplate(tpl.id, updated); setEditingId(null); }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEdit={() => setEditingId(tpl.id)}
              onDelete={() => deleteTemplate(tpl.id)}
            />
          )
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: BelongingTemplate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{template.icon}</span>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{template.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{template.items.length}個のアイテム</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (showDelete) onDelete();
              else { setShowDelete(true); setTimeout(() => setShowDelete(false), 3000); }
            }}
            className={`p-1.5 rounded-lg transition-colors ${showDelete ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 text-slate-400 hover:text-red-500'}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {template.items.map((item, i) => (
          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item}</span>
        ))}
      </div>
    </div>
  );
}

function TemplateEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: BelongingTemplate;
  onSave: (tpl: BelongingTemplate) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? '📋');
  const [items, setItems] = useState<string[]>(initial?.items ?? []);
  const [newItem, setNewItem] = useState('');

  function addItem() {
    const v = newItem.trim();
    if (v && !items.includes(v)) {
      setItems((prev) => [...prev, v]);
      setNewItem('');
    }
  }

  function save() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? generateId(),
      name: name.trim(),
      icon,
      items,
    });
  }

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setIcon(e)}
              className={`text-xl p-1 rounded-lg transition-colors ${icon === e ? 'bg-blue-100 ring-2 ring-blue-300' : 'hover:bg-slate-100'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="テンプレート名 *"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex-1 text-sm bg-slate-50 px-3 py-1.5 rounded-lg text-slate-700">{item}</span>
            <button
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            placeholder="アイテムを追加..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={addItem} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          キャンセル
        </button>
        <button onClick={save} className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
          <Save size={14} />
          保存
        </button>
      </div>
    </div>
  );
}
