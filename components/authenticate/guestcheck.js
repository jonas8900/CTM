export default function GuestCheck() {
  const { loading, known, user } = useGuest();

  if (loading) return <div>Loading...</div>;
  if (!known) return <div>Unknown user</div>;

  return (
    <div>
      <h2>Welcome back, {user.firstname} {user.lastname}!</h2>
    </div>
  );
}
