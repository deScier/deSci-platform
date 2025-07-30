import { twMerge } from "tailwind-merge";

import React from "react";

/**
 * @title Root Component
 * @notice Componente Root para estruturar elementos filhos com estilos e layout específicos.
 * @dev Este componente cria um container div com estilos definidos pelo Tailwind CSS.
 */
const Root: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <React.Fragment>
      <div className={twMerge("grid gap-4 grid-flow-col justify-start items-center mb-4 md:mb-8", className)}>
        {children}
      </div>
    </React.Fragment>
  );
};

/**
 * @title Title Component
 * @notice Componente Title para exibir títulos com estilos específicos.
 * @dev Este componente renderiza um título h1 com estilos Tailwind CSS.
 */
const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <React.Fragment>
      <h1 className={twMerge("text-1xl lg:text-2xl font-semibold", className)}>{children}</h1>
    </React.Fragment>
  );
};

/**
 * @title Icon Component
 * @notice Componente Icon para exibir ícones ou elementos visuais.
 * @dev Este componente simplesmente retorna seus filhos, permitindo flexibilidade na inserção de ícones ou outros elementos.
 */
const Icon: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  return <React.Fragment>{children} </React.Fragment>;
};

export { Icon, Root, Title };
