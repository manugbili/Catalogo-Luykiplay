import { useEffect, useState } from "react";
import { ArrowUpDown, Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "./supabase";

const money = (n) => new Intl.NumberFormat("es-CL").format(Number(n || 0));

export default function PriceLists({ products, close, onPricesUpdated }) {
  const [lists, setLists] = useState([]);
  const [cur, setCur] = useState(null);
  const [items, setItems] = useState([]);
  const [toAdd, setToAdd] = useState("");
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const loadLists = async () => {
    const { data, error } = await supabase.from("price_lists").select("*").order("created_at");
    if (error) { setLoading(false); return alert(error.message); }
    setLists(data || []);
    if (data?.length && !data.some((l) => l.id === cur)) setCur(data[0].id);
    if (!data?.length) setCur(null);
    setLoading(false);
  };

  const loadItems = async (id) => {
    if (!id) return setItems([]);
    const { data, error } = await supabase.from("price_list_items").select("*").eq("list_id", id);
    if (error) return alert(error.message);
    const nextItems = data || [];
    setItems(nextItems);
    setDrafts(Object.fromEntries(nextItems.map((item) => [item.product_id, item.price])));
  };

  useEffect(() => { loadLists(); }, []);
  useEffect(() => { loadItems(cur); }, [cur]);

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const free = products.filter((p) => !items.some((i) => i.product_id === p.id));

  const newList = async () => {
    const name = prompt("Nombre de la nueva lista (ej: Mayorista)");
    if (!name?.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("price_lists").insert({ name: name.trim() }).select().single();
    setSaving(false);
    if (error) return alert(error.message);
    await loadLists();
    setCur(data.id);
  };

  const renameList = async () => {
    const current = lists.find((l) => l.id === cur);
    const name = prompt("Nuevo nombre", current?.name);
    if (!name?.trim()) return;
    const { error } = await supabase.from("price_lists").update({ name: name.trim() }).eq("id", cur);
    if (error) return alert(error.message);
    loadLists();
  };

  const delList = async () => {
    if (!confirm("¿Eliminar esta lista de precio? Esta acción no se puede deshacer.")) return;
    const { error } = await supabase.from("price_lists").delete().eq("id", cur);
    if (error) return alert(error.message);
    setCur(null);
    loadLists();
  };

  const add = async () => {
    const p = byId[toAdd] || free[0];
    if (!p || !cur) return;
    const { error } = await supabase.from("price_list_items").insert({ list_id: cur, product_id: p.id, price: p.price });
    if (error) return alert(error.message);
    setToAdd("");
    loadItems(cur);
  };

  const applyPrice = async (pid) => {
    const product = byId[pid];
    const newPrice = Math.max(0, Math.round(Number(drafts[pid]) || 0));
    if (!product) return alert("Este producto ya no existe en el catálogo.");
    if (newPrice <= 0) return alert("Ingresa un precio nuevo mayor que $0.");
    if (newPrice === Number(product.price)) return alert("El precio nuevo es igual al precio actual.");
    setSavingId(pid);
    const productResult = await supabase.from("products").update({
      previous_price: Number(product.price),
      price: newPrice
    }).eq("id", pid);
    if (productResult.error) { setSavingId(null); return alert(productResult.error.message); }
    const itemResult = await supabase.from("price_list_items").update({ price: newPrice }).eq("list_id", cur).eq("product_id", pid);
    setSavingId(null);
    if (itemResult.error) return alert(itemResult.error.message);
    await onPricesUpdated?.();
    await loadItems(cur);
  };

  const remove = async (pid) => {
    const { error } = await supabase.from("price_list_items").delete().eq("list_id", cur).eq("product_id", pid);
    if (error) return alert(error.message);
    loadItems(cur);
  };

  const bulk = async () => {
    const pct = Number(prompt("Ajustar y publicar todos los precios (%). Ej: 10 para subir, -15 para bajar", "10"));
    if (!Number.isFinite(pct) || pct === 0) return;
    const factor = 1 + pct / 100;
    if (factor < 0) return alert("El ajuste no puede dejar precios negativos.");
    if (!confirm(`¿Aplicar un ajuste de ${pct}% al catálogo? Los precios actuales quedarán como precios anteriores.`)) return;
    setSaving(true);
    const results = await Promise.all(items.map(async (item) => {
      const product = byId[item.product_id];
      if (!product) return { error: null };
      const currentPrice = Number(product.price) || 0;
      const newPrice = Math.max(0, Math.round((currentPrice * factor) / 10) * 10);
      const productResult = await supabase.from("products").update({ previous_price: currentPrice, price: newPrice }).eq("id", item.product_id);
      if (productResult.error) return productResult;
      return supabase.from("price_list_items").update({ price: newPrice }).eq("list_id", cur).eq("product_id", item.product_id);
    }));
    setSaving(false);
    const failed = results.find((result) => result.error);
    if (failed) return alert(failed.error.message);
    await onPricesUpdated?.();
    await loadItems(cur);
  };

  if (loading) return (
    <div className="backdrop"><div className="modal-shell"><div className="modal pricelists-modal"><p className="empty">Cargando listas…</p></div></div></div>
  );

  return (
    <div className="backdrop" onMouseDown={close}>
      <div className="modal-shell" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal pricelists-modal">
          <button className="close" onClick={close} aria-label="Cerrar"><X /></button>
          <small>LISTAS DE PRECIO</small>
          <h2>Administra tus listas</h2>
          <p className="pl-help">Escribe el precio nuevo y presiona <b>Actualizar</b>. El precio actual quedará como precio anterior y el cambio aparecerá inmediatamente en el producto.</p>

          <div className="pl-row">
            <select value={cur || ""} onChange={(event) => setCur(event.target.value)} aria-label="Lista de precio">
              {!lists.length && <option value="">Sin listas</option>}
              {lists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}
            </select>
            <button className="outline" onClick={newList} disabled={saving}><Plus /> Nueva lista</button>
            {cur && <button className="outline" onClick={renameList}>Renombrar</button>}
            {cur && <button className="icon" onClick={delList} title="Eliminar lista" aria-label="Eliminar lista"><Trash2 /></button>}
          </div>

          {!lists.length && <p className="empty">Aún no tienes listas. Crea la primera para fijar precios distintos, por ejemplo para venta mayorista.</p>}

          {cur && (
            <>
              <div className="pl-row">
                <select value={toAdd} onChange={(event) => setToAdd(event.target.value)} aria-label="Producto a agregar" disabled={!free.length}>
                  {free.length
                    ? free.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)
                    : <option>Todos los productos ya están en esta lista</option>}
                </select>
                <button className="primary" onClick={add} disabled={!free.length}><Plus /> Agregar</button>
                <button className="outline" onClick={bulk} disabled={!items.length || saving}><ArrowUpDown /> Ajustar todos</button>
              </div>

              <div className="pl-table-wrap">
                <table className="pl-table">
                  <thead><tr><th>Producto</th><th>Precio actual</th><th>Precio nuevo</th><th>Acción</th><th /></tr></thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.product_id}>
                        <td>{byId[item.product_id]?.name || "(producto eliminado)"}</td>
                        <td className="pl-current">${money(byId[item.product_id]?.price ?? 0)}</td>
                        <td>
                          <div className="pl-price-field"><span>$</span><input className="pl-price" type="number" min="0" step="10"
                            value={drafts[item.product_id] ?? ""}
                            onChange={(event) => setDrafts((current) => ({ ...current, [item.product_id]: event.target.value }))}
                            aria-label={`Precio nuevo de ${byId[item.product_id]?.name || "producto"}`} /></div>
                        </td>
                        <td><button className="primary pl-apply" onClick={() => applyPrice(item.product_id)} disabled={savingId === item.product_id}><Save /> {savingId === item.product_id ? "Guardando…" : "Actualizar"}</button></td>
                        <td><button className="icon" onClick={() => remove(item.product_id)} title="Quitar de la lista" aria-label="Quitar producto"><Trash2 /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!items.length && <p className="empty">Esta lista está vacía. Agrega un producto para empezar.</p>}
              {saving && <p className="pl-saving">Guardando…</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
