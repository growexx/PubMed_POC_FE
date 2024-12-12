import React, { memo, useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  notification,
  Typography,
  Input,
} from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import debounce from "lodash.debounce"; 
import {
  StyledButton,
  FilesTable,
  UploadSection,
  SectionTitle,
  UploadFilesWrapper,
  SearchInputWrapper,   
  ButtonGroupWrapper,
  StyledModal
} from "./UploadFilesStyled"; 

const { Text } = Typography;

const STATUS_IDLE = 0;
const STATUS_UPLOADING = 1;

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState(STATUS_IDLE);
  const [storedFiles, setStoredFiles] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [sorter, setSorter] = useState({
    field: null,
    order: null,
  });

  const [fileToDelete, setFileToDelete] = useState(null);

  const debouncedFetchFiles = useCallback(
    debounce((params) => {
      fetchFiles(params);
    }, 500), 
    []
  );

  useEffect(() => {
    debouncedFetchFiles({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search: searchQuery,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
    
    return () => {
      debouncedFetchFiles.cancel();
    };
  }, [pagination.current, pagination.pageSize, searchQuery, sorter, debouncedFetchFiles]);

  const fetchFiles = ({
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
  }) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", pageSize);
    if (search) params.append("search", search);
    if (sortField && sortOrder) {
      params.append("key", sortField);
      params.append("direction", sortOrder === "ascend" ? "asc" : "desc");
    }

    fetch(`${process.env.REACT_APP_API_URL}/files?${params.toString()}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setStoredFiles(data?.files || []);
        setPagination((prev) => ({
          ...prev,
          total: data.total_files || 0,
        }));
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "Error",
          description: "Failed to fetch files.",
        });
      });
  };

  const uploadFiles = (data) => {
    setStatus(STATUS_UPLOADING);

    fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Upload failed");
        }
        return res.json();
      })
      .then(() => {
        notification.success({
          message: "Success",
          description: "Files uploaded successfully.",
        });
        setSelectedFiles([]);
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchFiles({
          page: 1,
          pageSize: pagination.pageSize,
          search: searchQuery,
          sortField: sorter.field,
          sortOrder: sorter.order,
        });
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "Error",
          description: "Failed to upload files.",
        });
      })
      .finally(() => setStatus(STATUS_IDLE));
  };

  const packFiles = (files) => {
    const data = new FormData();
    files.forEach((file) => {
      data.append("files[]", file);
    });
    return data;
  };

  const handleUploadClick = () => {
    if (selectedFiles.length) {
      const data = packFiles(selectedFiles);
      uploadFiles(data);
    }
  };

  const handleDeleteFile = (fileName) => {
    setDeleteLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/delete/${fileName}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Delete failed");
        }
        return res.json();
      })
      .then(() => {
        notification.success({
          message: "Success",
          description: "File deleted successfully.",
        });
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchFiles({
          page: 1,
          pageSize: pagination.pageSize,
          search: searchQuery,
          sortField: sorter.field,
          sortOrder: sorter.order,
        });
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "Error",
          description: "Failed to delete file.",
        });
      })
      .finally(() => {
        setDeleteLoading(false);
        setDeleteModalVisible(false);
        setFileToDelete(null);
      });
  };

  const handleDeleteAll = () => {
    setDeleteAllLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/delete-all`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Delete all failed");
        }
        return res.json();
      })
      .then(() => {
        notification.success({
          message: "Success",
          description: "All files deleted successfully.",
        });
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchFiles({
          page: 1,
          pageSize: pagination.pageSize,
          search: searchQuery,
          sortField: sorter.field,
          sortOrder: sorter.order,
        });
      })
      .catch((err) => {
        console.error(err);
        notification.error({
          message: "Error",
          description: "Failed to delete all files.",
        });
      })
      .finally(() => {
        setDeleteAllLoading(false);
        setDeleteAllModalVisible(false);
      });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const allowedFileTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const filtered = selected.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    if (filtered.length !== selected.length) {
      notification.error({
        message: "Invalid File Type",
        description: "Only PDF, TXT, DOC, and DOCX files are allowed.",
      });
    }

    setSelectedFiles(filtered);
  };

  const handleTableChange = (newPagination, filters, newSorter) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
      total: pagination.total, 
    });

    setSorter({
      field: newSorter.field,
      order: newSorter.order,
    });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showDeleteModal = (fileName) => {
    setFileToDelete(fileName);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      handleDeleteFile(fileToDelete);
    }
  };

  const handleModalCancel = () => {
    setDeleteModalVisible(false);
    setFileToDelete(null);
  };

  const showDeleteAllModal = () => {
    setDeleteAllModalVisible(true);
  };

  const handleDeleteAllConfirm = () => {
    handleDeleteAll();
  };

  const handleDeleteAllCancel = () => {
    setDeleteAllModalVisible(false);
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder: sorter.field === "name" ? sorter.order : null,
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <StyledButton
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => showDeleteModal(record.name)}
        >
          Delete
        </StyledButton>
      ),
    },
  ];

  const dataSource = storedFiles.map((file, index) => ({
    key: index,
    name: file.file_name,
  }));

  return (
    <UploadFilesWrapper>
      <SectionTitle>Upload Files</SectionTitle>
      <UploadSection>
        <SearchInputWrapper>
          <Input
            className="search-input"
            placeholder="Search files"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </SearchInputWrapper>
        <ButtonGroupWrapper>
          <input
            className="upload-files-input"
            id="fileUpload"
            onChange={handleFileChange}
            type="file"
            multiple
            accept=".pdf, .txt, .doc, .docx"
            style={{ display: "none" }} 
          />
          <label htmlFor="fileUpload" className="upload-files-button">
            <UploadOutlined />{" "}
            {selectedFiles.length
              ? `Selected Files (${selectedFiles.length})`
              : "Select Files"}
          </label>

          {selectedFiles?.length > 0 && (
            <StyledButton
              type="primary"
              onClick={handleUploadClick}
              disabled={status === STATUS_UPLOADING || selectedFiles.length === 0}
              loading={status === STATUS_UPLOADING}
              icon={<UploadOutlined />}
            >
              Upload Files
            </StyledButton>
          )}

          <StyledButton
            type="danger"
            onClick={showDeleteAllModal}
            icon={<DeleteOutlined />}
            disabled={storedFiles.length === 0}
          >
            Delete All
          </StyledButton>

          <StyledModal
            centered
            title="Delete File"
            okText="Delete"
            visible={deleteModalVisible}
            onOk={handleDeleteConfirm}
            onCancel={handleModalCancel}
            closeIcon={false}
            width={448}
            confirmLoading={deleteLoading}
          >
            Are you sure you want to delete this file?
          </StyledModal>

          <StyledModal
            centered
            title="Delete All Files"
            okText="Delete"
            visible={deleteAllModalVisible}
            onOk={handleDeleteAllConfirm}
            onCancel={handleDeleteAllCancel}
            closeIcon={false}
            width={448}
            confirmLoading={deleteAllLoading}
          >
            Are you sure you want to delete all files?
          </StyledModal>
        </ButtonGroupWrapper>
      </UploadSection>

      <FilesTable
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        locale={{ emptyText: "No files uploaded." }}
      />
    </UploadFilesWrapper>
  );
};

export default memo(UploadFiles);
