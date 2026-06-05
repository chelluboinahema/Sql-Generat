import { FiTrash, FiUser } from "react-icons/fi";

export default function AdminCard({ item, remove }) {
  return (
    <div className="bg-card rounded-3xl p-6 mb-5 ring-1 ring-accent/10">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-3">
            <FiUser className="text-primary" />

            <h2 className="text-white font-semibold">{item.user?.email || "Unknown"}</h2>
          </div>

          <div className="mt-5 text-slate-200">{item.inputText}</div>

          <pre className="mt-5 whitespace-pre-wrap bg-slate-900 p-4 rounded-md text-sm text-slate-100">{item.generatedSql}</pre>
        </div>

        <button
          className="bg-gradient-to-r from-primary to-accent h-12 px-5 rounded-xl text-white shadow"
          onClick={() => remove(item.id)}
        >
          <FiTrash />
        </button>
      </div>
    </div>
  );
}
