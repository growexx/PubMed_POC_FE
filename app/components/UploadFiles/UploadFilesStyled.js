import styled from "styled-components";
import { Button, Table, Modal, Pagination } from "antd";

export const UploadFilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  width: 100%;
  height: 100vh; 
  overflow-y: auto;
  padding-right: 10px;

  .search-input{
  color: @primary-font-color;
    background-color: @sidebar-bg;
    border-color: @sidebar-bg;

    .ant-input-clear-icon {
    color: @primary-font-color;
    }
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: @primary-font-color;
`;

export const UploadSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SearchInputWrapper = styled.div`
  flex: 0 1 300px; 
  max-width: 300px;

  .ant-input {
    height: 30px; 
    color: @primary-font-color;
    background-color: @sidebar-bg;
    border-color: @sidebar-bg;
  }
`;

export const ButtonGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .upload-files-input {
    display: none;
  }

  .upload-files-button {
    display: flex;
    align-items: center;
    background-color: @button-color;
    color: @primary-font-color;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 40px; 

    svg {
      margin-right: 8px;
    }
  }

  .ant-btn {
    height: 40px; 
  }
`;


export const FilesTable = styled(Table)`
  .ant-table {
    border-collapse: collapse;
    color: @primary-font-color;
    border: 1px solid @primary-font-color;
    overflow-y: auto;
  }

  .ant-table-thead > tr > th {
    background-color: @chat-bot-bg;
    color: @primary-font-color;
    text-align: left;
    border-color: @primary-font-color;

    :hover{
    background: @chat-bot-bg !important;
    }
  }

  .ant-table-empty .ant-table-tbody > tr.ant-table-placeholder{
     color: @primary-font-color !important;
  }

  .ant-table-tbody > tr > td {
    background-color: @chat-bot-bg;
    border: none;

    :hover{
    background: @chat-bot-bg !important;
    }

    .ant-typography {
      color: @primary-font-color;
    }
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: @chat-bot-bg !important;
  }

 .ant-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: end;
    color: @primary-font-color;

    .ant-pagination-item, 
    .ant-pagination-item-link, 
    .ant-pagination-prev, 
    .ant-pagination-next {
       background-color: @primary-font-color;
       color: @button-color;
       border: none;
    }

    .ant-pagination-item a, 
    .ant-pagination-item-link a {
       color: @button-color;
    }

    .ant-pagination-item-active {
      background-color: @button-color;
    color: @primary-font-color;
    border: none;
    }

    .ant-pagination-item-active a {
      color: @primary-font-color;
    }

    .ant-pagination-item:hover, 
    .ant-pagination-item-link:hover {
      background-color: @sidebar-bg;
    color: @primary-font-color;
    border: none;
    }
  }

.ant-select-dropdown {
  background-color: @sidebar-bg;
}

.ant-select-item-option-content {
  color: @primary-font-color;
}

.ant-select-item-option-active {
  background-color: @button-color;
}

.ant-select-item-option-selected {
  background-color: @button-color; 
  color: @primary-font-color;
}

.ant-select-dropdown {
  border-color: @button-color;
}

.ant-select-selector {
  background-color: @button-color !important;
  color: @primary-font-color !important; 
  border-color: @primary-font-color; 
}

.ant-select-selector:hover {
  background-color: @button-color !important;
  color: @primary-font-color !important; 
  border-color: @primary-font-color;
}

.ant-select-arrow {
  color: @primary-font-color;; 
}

.ant-select-focused .ant-select-selector {
  background-color: @button-color !important;
  color: @primary-font-color !important; 
  border-color: @primary-font-color;
}


`;

export const StyledButton = styled(Button)`
  background-color: @sidebar-bg;
  color: @primary-font-color;
  border-color: @sidebar-bg;
  height: 40px; /* Ensure same height as search input */

  display: flex;
  align-items: center;

  :hover {
    background-color: @chat-bot-bg;
    color: @primary-font-color;
    border-color: @sidebar-bg;
  }

  :focus {
    background-color: @chat-bot-bg;
    color: @primary-font-color;
    border-color: @sidebar-bg;
  }
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: @chat-bot-bg;
  }

  .ant-modal-header {
    border-bottom: 1px solid @primary-font-color;;
  }


  .ant-modal-header, .ant-modal-content, .ant-modal-title{
  background-color: @chat-bot-bg;
  color: @primary-font-color;
  }


  .ant-btn-primary {
    background-color: @button-color;
    color: @primary-font-color;
    &:hover {
     background-color: @button-color;
     color: @primary-font-color;
    }
  }

  .ant-btn-default {
     background-color: @primary-font-color;
    color: @button-color;
    &:hover {
     background-color: @primary-font-color;
    color: @button-color;
    }
  }
`;
