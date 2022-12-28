<main class="pt-10">
  <div class="max-w-xl px-10 mx-auto flex flex-col justify-center items-center">
    <h1 class="text-4xl font-bold mb-4">Sign Up</h1>
    <p class="mb-8">
      Already have an account? <a
        class="underline font-bold"
        href="/auth/sign-in">Sign In</a>
    </p>
    <div class="w-full">
      <form
        method="POST"
        action="?/sign-up"
        class="p-8 border flex flex-col gap-6 dark:bg-slate-800 shadow-cyan-600 border-cyan-700 shadow-md">
        <label class="flex flex-col gap-1">
          Name
          <input
            class="border p-4 dark:border dark:border-cyan-600 dark:bg-slate-700"
            type="text"
            name="name"
            placeholder="Name"
            required />
        </label>
        <label class="flex flex-col gap-1">
          Email
          <input
            class="border p-4 dark:border dark:border-cyan-600 dark:bg-slate-700"
            type="email"
            name="email"
            placeholder="Email"
            required />
        </label>
        <label class="flex flex-col gap-1">
          Password
          <input
            class="border p-4 dark:border dark:border-cyan-600 dark:bg-slate-700"
            type="password"
            name="password"
            placeholder="Password"
            required />
        </label>
        <!-- <input
      class="border p-4"
      type="password"
      placeholder="Confirm Password" /> -->
        <button
          type="submit"
          class="mt-8 bg-cyan-700 self-center px-20 py-4 font-mono text-white font-bold">Sign Up</button>
      </form>
    </div>
  </div>
</main>
