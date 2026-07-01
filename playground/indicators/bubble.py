import numpy as np
import pandas as pd

# df debe contener:
# timestamp, buy_qty, sell_qty

# 1. Desequilibrio normalizado (-1 a +1)
df["delta_pct"] = (
    (df["buy_qty"] - df["sell_qty"])
    / (df["buy_qty"] + df["sell_qty"])
)

# Evitar NaN cuando buy_qty + sell_qty = 0
df["delta_pct"] = df["delta_pct"].fillna(0)

# 2. Suavizado EMA
df["signal"] = (
    df["delta_pct"]
    .ewm(span=20, adjust=False)
    .mean()
)

# 3. Filtro de ruido
THRESHOLD = 0.15

df["show_bubble"] = (
    df["signal"].abs() > THRESHOLD
)

# 4. Color de la esfera
df["bubble_color"] = np.where(
    ~df["show_bubble"],
    "gray",
    np.where(
        df["signal"] > 0,
        "green",
        "red"
    )
)

# 5. Tamaño de la esfera
df["bubble_size"] = np.where(
    df["show_bubble"],
    10 + 40 * df["signal"].abs(),
    0
)

# Resultado final
result = df[
    [
        "timestamp",
        "buy_qty",
        "sell_qty",
        "delta_pct",
        "signal",
        "show_bubble",
        "bubble_color",
        "bubble_size"
    ]
]

print(result.tail())