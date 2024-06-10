import { useCallback, ChangeEvent } from 'react';
import { PrimitiveAtom, atom, useAtom } from 'jotai';

export interface UseAtomInputHookType {
  atom: PrimitiveAtom<string> & { init: string; };
}

export function useAtomInput({ atom }: UseAtomInputHookType) {
  const [value, setValue] = useAtom(atom);

  const onChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => { setValue(event.target.value); }, [setValue],);

  return { value, setValue, onChange };
}

const TextSearchAtom = atom<string>('');

export function useSearch() {
  const TextSearch = useAtomInput({ atom: TextSearchAtom });

  return {
    TextSearch
  }
}