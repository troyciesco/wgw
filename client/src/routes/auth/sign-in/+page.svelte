<main class="pt-10">
  <div class="max-w-xl px-10 mx-auto flex flex-col justify-center items-center">
    <h1 class="text-4xl font-bold mb-4">Sign In</h1>
    <p class="mb-8">
      Need an Account? <a
        class="underline font-bold"
        href="/auth/sign-up">Sign Up</a>
    </p>
    <div class="w-full">
      <form
        method="POST"
        action="?/sign-in"
        class="p-8 border flex flex-col gap-6 rounded-lg dark:bg-slate-800 shadow-cyan-600 border-cyan-700 shadow-md">
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
        <button
          type="submit"
          class="mt-8 bg-cyan-700 self-center px-20 py-4 font-mono text-white font-bold ">Sign In</button>
        <a
          href="/auth/forgot-password"
          class="text-center mt-10 text-sm"><span class="underline">Forgot Password</span> 😢</a>
      </form>
    </div>
  </div>
</main>
