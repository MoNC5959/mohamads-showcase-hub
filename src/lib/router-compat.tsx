// Thin compatibility layer so the imported pages keep their original link/navigate code on TanStack Router.
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Link as TLink, useNavigate as useTNavigate, useLocation as useTLocation } from "@tanstack/react-router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TLink ref={ref} to={to as any} {...(rest as any)} />;
});

export function useNavigate() {
  const navigate = useTNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (to: string) => navigate({ to: to as any });
}

export function useLocation() {
  return useTLocation();
}
