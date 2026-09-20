"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { masuk, type StateLogin } from "@/app/admin/login/actions";

export default function FormLogin() {
  const [state, formAction, pending] = useActionState<StateLogin, FormData>(
    masuk,
    {},
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-xl border border-garis-kuat bg-panel p-7"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded-md border border-garis-kuat bg-panel-2 px-4 text-base transition-[border-color] duration-200 focus-visible:border-aksen"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 rounded-md border border-garis-kuat bg-panel-2 px-4 text-base transition-[border-color] duration-200 focus-visible:border-aksen"
        />
      </div>

      {state.pesan && (
        <p role="alert" className="flex gap-2.5 text-sm text-bahaya">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {state.pesan}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-md bg-aksen font-semibold text-latar transition-[background-color,opacity] duration-200 hover:bg-aksen-terang disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            Masuk…
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}
