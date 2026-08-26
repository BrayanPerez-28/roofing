"use client";

import { useState, useCallback } from "react";
import { contactsApi } from "../_lib/api";
import type { Contact, ContactUpdatePayload, PaginatedResponse } from "../_lib/types";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0, last_page: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params: { per_page?: number; page?: number } = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const res: PaginatedResponse<Contact> = await contactsApi.list({
          per_page: 10,
          page: 1,
          ...params,
        });
        setContacts(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load contacts";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (id: number, payload: ContactUpdatePayload): Promise<Contact> => {
      const res = await contactsApi.update(id, payload);
      const updated = res.data as Contact;
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    await contactsApi.delete(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
  }, []);

  return { contacts, meta, isLoading, error, fetch, update, remove };
}
