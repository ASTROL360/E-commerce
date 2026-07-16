export default function VariantEditor({ variants, onChange }) {
  function addVariant() {
    onChange([...variants, {}]);
  }

  function removeVariant(index) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index, field, value) {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    onChange(updated);
  }

  return (
    <div className="variant-editor wide">
      <div className="variant-head">
        <strong>Variants</strong>
        <button className="secondary-button" type="button" onClick={addVariant}>
          Add Variant
        </button>
      </div>
      <div id="variant-list">
        {variants.map((variant, i) => (
          <div className="variant-form-row" key={i}>
            <input
              placeholder="Size"
              value={variant.size || ""}
              onChange={(e) => updateVariant(i, "size", e.target.value)}
              required
            />
            <input
              placeholder="Color"
              value={variant.color || ""}
              onChange={(e) => updateVariant(i, "color", e.target.value)}
              required
            />
            <input
              placeholder="Price"
              type="number"
              min="1"
              step="0.01"
              value={variant.price || ""}
              onChange={(e) => updateVariant(i, "price", Number(e.target.value))}
              required
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={variant.stockQty ?? ""}
              onChange={(e) => updateVariant(i, "stockQty", Number(e.target.value))}
              required
            />
            <input
              placeholder="SKU"
              value={variant.sku || ""}
              onChange={(e) => updateVariant(i, "sku", e.target.value)}
            />
            <button className="danger-button" type="button" onClick={() => removeVariant(i)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
