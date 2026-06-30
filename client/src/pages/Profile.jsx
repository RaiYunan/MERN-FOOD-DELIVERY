import { useState, useEffect, useRef } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Check,
  X,
  Clock,
  ChevronRight,
  ShoppingBag,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  fetchMe,
  logout,
  updateProfile,
  changePassword,
  deleteAccount,
} from "@/features/auth/authSlice";
import { getMyOrders } from "@/features/order/orderSlice";
import { Link, useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  pending: { dot: "bg-turmeric", text: "text-turmeric", label: "Pending" },
  confirmed: { dot: "bg-cardamom", text: "text-cardamom", label: "Confirmed" },
  preparing: { dot: "bg-turmeric", text: "text-turmeric", label: "Preparing" },
  delivered: { dot: "bg-cardamom", text: "text-cardamom", label: "Delivered" },
  cancelled: { dot: "bg-chili", text: "text-chili", label: "Cancelled" },
};

function FieldRow({
  label,
  value,
  icon: Icon,
  editing,
  name,
  onChange,
  type = "text",
}) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-clay/60 dark:border-border-dark last:border-0">
      <Icon
        size={15}
        className="text-chili mt-0.5 shrink-0"
        strokeWidth={1.75}
      />
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-1">
          {label}
        </p>
        {editing ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent font-body text-base text-ink dark:text-text-dark border-b border-chili outline-none pb-0.5"
          />
        ) : (
          <p className="font-body text-base text-ink dark:text-text-dark truncate">
            {value || (
              <span className="text-ink/30 dark:text-text-dark/30 italic">
                Not set
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const isLoading = status === "loading";
  const mismatch = form.confirm && form.confirm !== form.newPassword;
  const tooShort = form.newPassword && form.newPassword.length < 6;
  const canSubmit =
    form.currentPassword &&
    form.newPassword.length >= 6 &&
    form.newPassword === form.confirm &&
    !isLoading;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const result = await dispatch(
      changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );
    if (changePassword.fulfilled.match(result)) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm p-7 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark mb-1">
          Change password
        </h3>
        <p className="font-body text-sm text-ink/55 dark:text-text-dark/55 mb-6">
          Choose something you haven't used before.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            {
              key: "currentPassword",
              label: "Current password",
              showKey: "current",
            },
            { key: "newPassword", label: "New password", showKey: "next" },
            {
              key: "confirm",
              label: "Confirm new password",
              showKey: "confirm",
            },
          ].map(({ key, label, showKey }) => (
            <div key={key}>
              <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 pr-10 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 outline-none focus:border-chili rounded-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((s) => ({ ...s, [showKey]: !s[showKey] }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                  tabIndex={-1}
                >
                  {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {tooShort && (
            <p className="font-body text-xs text-chili">
              At least 6 characters
            </p>
          )}
          {mismatch && (
            <p className="font-body text-xs text-chili">
              Passwords do not match
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-ink dark:bg-chili hover:bg-chili dark:hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving…" : "Update password"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm rounded-sm hover:border-ink/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((s) => s.auth);
  const [password, setPassword] = useState("");
  const isLoading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    const result = await dispatch(deleteAccount(password));
    if (deleteAccount.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm p-7 shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle
            size={20}
            className="text-chili shrink-0 mt-0.5"
            strokeWidth={1.75}
          />
          <div>
            <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark">
              Delete your account?
            </h3>
            <p className="font-body text-sm text-ink/55 dark:text-text-dark/55 mt-1">
              This is permanent. All your data, including order history, will be
              gone for good.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
            Confirm with your password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 outline-none focus:border-chili rounded-sm transition-colors mb-5"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!password || isLoading}
              className="flex-1 bg-chili hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? "Deleting…" : "Delete my account"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm rounded-sm hover:border-ink/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, status } = useAppSelector((s) => s.auth);
  const { orders, status: orderStatus } = useAppSelector((s) => s.order);
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchMe());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    fd.append("address", form.address);
    if (avatarFile) fd.append("avatar", avatarFile);

    const result = await dispatch(updateProfile(fd));
    if (updateProfile.fulfilled.match(result)) {
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (status === "loading" && !user) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-dark flex items-center justify-center">
        <p className="font-body text-ink/40 dark:text-text-dark/40 text-sm">
          Loading…
        </p>
      </div>
    );
  }

  const initials =
    (form.name || user?.name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const allItemNames = orders.flatMap(
    (o) => o.items?.map((i) => i.product?.name || i.name || "") || [],
  );
  const favourite = allItemNames.length
    ? Object.entries(
        allItemNames.reduce(
          (acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }),
          {},
        ),
      ).sort((a, b) => b[1] - a[1])[0][0]
    : "—";

  const avatarUrl = avatarPreview || user?.avatar;

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen transition-colors">
      <section className="border-b border-clay dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row md:items-end gap-8">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-sm bg-ink dark:bg-chili flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-3xl font-bold text-cream tracking-tight">
                  {initials}
                </span>
              )}
            </div>
            {editing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-chili text-cream flex items-center justify-center border-2 border-cream dark:border-surface-dark hover:bg-chili-dark transition-colors"
                >
                  <Camera size={12} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="hidden"
                />
              </>
            )}
            {!editing && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-chili border-2 border-cream dark:border-surface-dark" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-2">
              Your profile
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink dark:text-text-dark leading-[1.05] tracking-tight">
              {form.name || "Hello there"}
            </h1>
            {user?.createdAt && (
              <p className="font-body text-ink/50 dark:text-text-dark/50 text-sm mt-1">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-NP", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-1.5 bg-ink dark:bg-chili text-cream font-body text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-chili transition-colors disabled:opacity-60"
                >
                  <Check size={15} />{" "}
                  {status === "loading" ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 border border-clay dark:border-border-dark text-ink/60 dark:text-text-dark/60 font-body text-sm font-semibold px-4 py-2.5 rounded-sm hover:border-ink/40 transition-colors"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 border border-clay dark:border-border-dark text-ink/70 dark:text-text-dark/70 font-body text-sm font-semibold px-5 py-2.5 rounded-sm hover:border-chili hover:text-chili transition-colors"
              >
                <Edit3 size={14} /> Edit details
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.1fr] gap-12 items-start">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark mb-1">
            Account details
          </h2>
          <div
            className="h-0.5 w-8 bg-chili mb-6"
            style={{
              maskImage: "linear-gradient(90deg, black 0%, transparent 100%)",
            }}
          />

          <div className="bg-clay-light/40 dark:bg-card-dark/50 border border-clay/60 dark:border-border-dark rounded-sm px-6">
            <FieldRow
              label="Full name"
              value={form.name}
              icon={User}
              editing={editing}
              name="name"
              onChange={handleChange}
            />
            <FieldRow
              label="Email"
              value={user?.email}
              icon={Mail}
              editing={false}
              name="email"
            />
            <FieldRow
              label="Phone"
              value={form.phone}
              icon={Phone}
              editing={editing}
              name="phone"
              onChange={handleChange}
              type="tel"
            />
            <FieldRow
              label="Delivery address"
              value={form.address}
              icon={MapPin}
              editing={editing}
              name="address"
              onChange={handleChange}
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-px bg-clay/40 dark:bg-border-dark border border-clay/60 dark:border-border-dark">
            {[
              { label: "Orders", value: orders.length },
              {
                label: "Spent",
                value: `Rs. ${totalSpent.toLocaleString("en-NP")}`,
              },
              { label: "Favourite", value: favourite.split(" ")[0] || "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-cream dark:bg-surface-dark px-4 py-5"
              >
                <p className="font-display text-2xl font-bold text-ink dark:text-text-dark truncate">
                  {stat.value}
                </p>
                <p className="font-body text-xs uppercase tracking-wider text-ink/40 dark:text-text-dark/40 font-semibold mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark">
              Recent orders
            </h2>
            <Link
              to="/orders"
              className="font-body text-sm font-semibold text-chili hover:text-chili-dark hidden md:inline"
            >
              All orders →
            </Link>
          </div>
          <div
            className="h-0.5 w-8 bg-chili mb-6"
            style={{
              maskImage: "linear-gradient(90deg, black 0%, transparent 100%)",
            }}
          />

          {orderStatus === "loading" && (
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 py-8 text-center">
              Loading orders…
            </p>
          )}

          {orderStatus === "succeeded" && recentOrders.length === 0 && (
            <div className="border border-clay/60 dark:border-border-dark rounded-sm px-6 py-10 text-center">
              <ShoppingBag
                size={28}
                className="text-ink/20 dark:text-text-dark/20 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="font-body text-sm text-ink/50 dark:text-text-dark/50">
                No orders yet.
              </p>
              <Link
                to="/menu"
                className="font-body text-sm font-semibold text-chili hover:text-chili-dark mt-2 inline-block"
              >
                Browse the menu →
              </Link>
            </div>
          )}

          {recentOrders.length > 0 && (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
                const itemSummary = order.items
                  ?.map((i) => `${i.product?.name || i.name} ×${i.quantity}`)
                  .join(", ");

                return (
                  <Link
                    to="/orders"
                    key={order._id}
                    className="group flex items-start gap-4 bg-clay-light/40 dark:bg-card-dark/50 border border-clay/60 dark:border-border-dark px-5 py-5 hover:border-chili/40 transition-colors rounded-sm"
                  >
                    <div className="w-9 h-9 rounded-sm bg-ink/5 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <ShoppingBag
                        size={16}
                        className="text-ink/40 dark:text-text-dark/40"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`font-body text-xs font-semibold flex items-center gap-1.5 ${s.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </div>
                      <p className="font-body text-sm text-ink/60 dark:text-text-dark/60 truncate">
                        {itemSummary}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                          Rs. {order.totalAmount?.toLocaleString("en-NP")}
                        </span>
                        <span className="font-body text-xs text-ink/40 dark:text-text-dark/40 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-NP",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-ink/20 dark:text-text-dark/20 group-hover:text-chili transition-colors shrink-0 mt-1"
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {recentOrders.length > 0 && (
            <div className="mt-6 border-l-2 border-chili pl-5 py-1">
              <p className="font-body text-sm text-ink/60 dark:text-text-dark/60">
                Last order was{" "}
                <span className="text-ink dark:text-text-dark font-semibold">
                  {recentOrders[0]?.items?.[0]?.product?.name ||
                    recentOrders[0]?.items?.[0]?.name ||
                    "your order"}
                </span>{" "}
                — want to go again?
              </p>
              <Link
                to="/menu"
                className="font-body text-sm font-semibold text-chili hover:text-chili-dark mt-1 inline-block"
              >
                Back to menu →
              </Link>
            </div>
          )}
        </div>
      </div>

      <section className="border-t border-clay dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold text-ink/40 dark:text-text-dark/40 uppercase tracking-widest mb-1">
                Security
              </p>
              <p className="font-body text-sm text-ink/60 dark:text-text-dark/50">
                Update your password regularly to keep your account safe.
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ink/70 dark:text-text-dark/70 hover:text-ink dark:hover:text-text-dark px-4 py-2.5 border cursor-pointer border-clay dark:border-border-dark rounded-sm hover:border-ink/40 transition-colors shrink-0"
            >
              <Lock size={14} /> Change password
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-clay/60 dark:border-border-dark">
            <div>
              <p className="font-body text-xs font-semibold text-ink/40 dark:text-text-dark/40 uppercase tracking-widest mb-1">
                Account
              </p>
              <p className="font-body text-sm text-ink/60 dark:text-text-dark/50">
                Need to step away? You can log out or delete your account at any
                time.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleLogout}
                className="font-body text-sm font-semibold text-ink/60 dark:text-text-dark/60 hover:text-ink dark:hover:text-text-dark px-4 py-2.5 border border-clay dark:border-border-dark rounded-sm hover:border-ink/40 transition-colors cursor-pointer"
              >
                Log out
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="font-body text-sm font-semibold text-chili/70 hover:text-chili px-4 py-2.5 border border-chili/20 cursor-pointer rounded-sm hover:border-chili/50 transition-colors"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </section>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}

export default Profile;
